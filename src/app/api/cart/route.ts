import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity = 1 } = body;

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id
        },
        data: {
          quantity: existingItem.quantity + quantity
        },
        include: {
          product: true
        }
      });

      return NextResponse.json(updatedItem);
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        },
        include: {
          product: true
        }
      });

      return NextResponse.json(newItem, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItemId, quantity } = body;

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItemId
      },
      data: {
        quantity
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItemId
      }
    });

    return NextResponse.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
} 