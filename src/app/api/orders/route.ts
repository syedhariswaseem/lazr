import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// Create an order for the authenticated user and decrement product stock atomically
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const items: Array<{ productId: string; quantity: number }> | undefined = body?.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Fetch all products involved to validate existence and pricing
    const productIds = [...new Set(items.map(i => i.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productById = new Map(products.map(p => [p.id, p]));

    // Validate items
    for (const item of items) {
      const p = productById.get(item.productId);
      if (!p) return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      if (item.quantity < 1) return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
      if (p.stockCount < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${p.name}`, productId: p.id, available: p.stockCount }, { status: 409 });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Re-check stock and decrement within transaction to minimize race conditions
      for (const item of items) {
        const p = await tx.product.findUnique({ where: { id: item.productId }, select: { stockCount: true } });
        if (!p || p.stockCount < item.quantity) {
          throw new Error(`OUT_OF_STOCK:${item.productId}`);
        }
        const newCount = p.stockCount - item.quantity;
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockCount: { decrement: item.quantity },
            inStock: newCount > 0,
          },
        });
      }

      // Use DB prices to compute totals
      const currentProducts = await tx.product.findMany({ where: { id: { in: productIds } } });
      const priceMap = new Map(currentProducts.map(p => [p.id, p.price]));

      const totalAmount = items.reduce((sum, i) => sum + (priceMap.get(i.productId)! * i.quantity), 0);

      const order = await tx.order.create({
        data: {
          userId: user.id,
          status: 'PENDING',
          totalAmount,
          orderItems: {
            create: items.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
              price: priceMap.get(i.productId)!,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      return order;
    });

    return NextResponse.json({ order: result }, { status: 201 });
  } catch (err: any) {
    if (typeof err?.message === 'string' && err.message.startsWith('OUT_OF_STOCK:')) {
      const productId = err.message.split(':')[1];
      return NextResponse.json({ error: 'Insufficient stock', productId }, { status: 409 });
    }
    console.error('Create order error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get current user's orders
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('List orders error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

