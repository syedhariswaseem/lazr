import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });

    const { paymentIntentId, sessionId } = await request.json();
    
    console.log('Order details API called with:', { paymentIntentId, sessionId });

    let paymentIntent: Stripe.Response<Stripe.PaymentIntent> | null = null;

    if (paymentIntentId) {
      console.log('Retrieving payment intent:', paymentIntentId);
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge', 'payment_method'],
      });
      console.log('Payment intent retrieved successfully');
    } else if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });
      const piId = (session.payment_intent as Stripe.PaymentIntent | null)?.id;
      if (!piId) {
        return NextResponse.json({ error: 'No payment intent found for session' }, { status: 400 });
      }
      paymentIntent = await stripe.paymentIntents.retrieve(piId, {
        expand: ['latest_charge', 'payment_method'],
      });
    } else {
      return NextResponse.json({ error: 'Missing paymentIntentId or sessionId' }, { status: 400 });
    }

    // Extract details
    const pi = paymentIntent!;
    const amount = (pi.amount ?? 0) / 100;
    const currency = pi.currency?.toUpperCase() ?? 'USD';
    const status = pi.status;

    const latestCharge = (pi.latest_charge as Stripe.Charge | null) || null;
    const billing = latestCharge?.billing_details;

    const customerEmail = pi.receipt_email || billing?.email || undefined;
    const customerName = billing?.name || undefined;

    // Items we stored in metadata when creating the intent
    let items: Array<{ name: string; quantity: number; price: number }> = [];
    try {
      const meta = (pi.metadata || {}) as Record<string, string>;
      if (meta.items) {
        const parsed = JSON.parse(meta.items);
        if (Array.isArray(parsed)) {
          items = parsed.map((it: { name?: string; quantity?: number; price?: number }) => ({
            name: String(it.name ?? 'Item'),
            quantity: Number(it.quantity ?? 1),
            price: Number(it.price ?? 0),
          }));
        }
      }
    } catch {}

    const orderId = `ORD-${pi.id.slice(-8).toUpperCase()}`;
    const createdAt = new Date((pi.created ?? Math.floor(Date.now() / 1000)) * 1000).toISOString();

    return NextResponse.json({
      orderId,
      total: amount, // Changed from 'amount' to 'total' to match frontend
      amount, // Keep both for backward compatibility
      currency,
      status,
      customerName: customerName ?? 'Customer',
      email: customerEmail ?? '',
      items,
      createdAt,
    });
  } catch (error) {
    console.error('Order details fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}