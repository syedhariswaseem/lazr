import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
}); 

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo, amount } = await request.json();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_company: customerInfo.company,
        shipping_address: customerInfo.address,
        shipping_city: customerInfo.city,
        shipping_state: customerInfo.state,
        shipping_zip: customerInfo.zipCode,
        shipping_country: customerInfo.country,
        items: JSON.stringify(items),
      },
      shipping: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        address: {
          line1: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          postal_code: customerInfo.zipCode,
          country: customerInfo.country,
        },
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 