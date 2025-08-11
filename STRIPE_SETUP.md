# Stripe Checkout Integration Setup

This guide will help you set up the Stripe checkout integration for the laser cutting app.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. The laser cutting app running locally

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Database Configuration (if using Prisma)
DATABASE_URL="file:./dev.db"

# Other Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Getting Your Stripe Keys

1. **Log into your Stripe Dashboard** at https://dashboard.stripe.com
2. **Go to Developers > API keys**
3. **Copy your publishable key** (starts with `pk_test_` or `pk_live_`)
4. **Copy your secret key** (starts with `sk_test_` or `sk_live_`)
5. **Replace the placeholder values** in your `.env.local` file

## Setting Up Webhooks (Optional but Recommended)

1. **Go to Developers > Webhooks** in your Stripe Dashboard
2. **Click "Add endpoint"**
3. **Enter your webhook URL**: `https://your-domain.com/api/webhooks/stripe`
   - For local development, you can use Stripe CLI or ngrok
4. **Select the following events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. **Copy the webhook signing secret** and add it to your `.env.local` file

## Testing the Integration

### Using Stripe Test Cards

Stripe provides test card numbers for testing:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

### Test Flow

1. **Start your development server**: `npm run dev`
2. **Navigate to the cart page**: `http://localhost:3000/cart`
3. **Click "Proceed to Checkout"**
4. **Fill in the customer information form**
5. **Click "Pay" to be redirected to Stripe Checkout**
6. **Use a test card number** to complete the payment
7. **You'll be redirected to the success page** after payment

## Features Implemented

### ✅ Completed Features

- **Complete checkout page** with customer information form
- **Stripe Checkout integration** for secure payment processing
- **Order summary** with item details and pricing
- **Success page** with order confirmation
- **Webhook handling** for payment events
- **Responsive design** that works on all devices
- **Error handling** for failed payments
- **Security features** including webhook signature verification

### 🔧 Technical Implementation

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Payment Processing**: Stripe Checkout
- **State Management**: React hooks
- **Form Validation**: HTML5 validation with custom error handling
- **Security**: Environment variables, webhook signatures, HTTPS

## File Structure

```
src/
├── app/
│   ├── checkout/
│   │   ├── page.tsx              # Main checkout page
│   │   └── success/
│   │       └── page.tsx          # Success page
│   └── api/
│       ├── create-checkout-session/
│       │   └── route.ts          # Creates Stripe checkout sessions
│       └── webhooks/
│           └── stripe/
│               └── route.ts      # Handles Stripe webhooks
```

## Customization

### Modifying the Checkout Form

The checkout form is located in `src/app/checkout/page.tsx`. You can:

- Add/remove form fields
- Change validation rules
- Modify the styling
- Add custom business logic

### Updating Product Information

Currently using mock data. In a real application, you would:

1. Connect to a database
2. Fetch cart items from a shopping cart system
3. Calculate taxes based on location
4. Apply discounts and promotions

### Styling

The app uses Tailwind CSS. You can customize:

- Colors (currently using red theme)
- Typography
- Layout and spacing
- Responsive breakpoints

## Security Considerations

- ✅ Environment variables for sensitive data
- ✅ Webhook signature verification
- ✅ HTTPS required for production
- ✅ No sensitive data stored in frontend
- ✅ Input validation and sanitization

## Production Deployment

Before deploying to production:

1. **Switch to live Stripe keys**
2. **Set up production webhooks**
3. **Configure your domain in Stripe**
4. **Test the complete payment flow**
5. **Set up monitoring and logging**
6. **Configure error handling and notifications**

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your environment variables are set correctly
3. Ensure your Stripe keys are valid
4. Check the Stripe Dashboard for payment status
5. Review the webhook logs in your Stripe Dashboard

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 