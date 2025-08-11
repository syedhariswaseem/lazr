'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Lock, Truck, Shield, XCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state } = useCart();
  const { items: cartItems } = state;
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Create PaymentIntent and get client secret
  useEffect(() => {
    if (cartItems.length === 0) return;

    const createIntent = async () => {
      try {
        setIsCreatingIntent(true);
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            customerInfo,
            amount: calculateTotal(),
          }),
        });
        if (!response.ok) throw new Error('Failed to initialize payment');
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setToast({ message: err instanceof Error ? err.message : 'Failed to initialize payment', type: 'error' });
      } finally {
        setIsCreatingIntent(false);
      }
    };

    createIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  const appearance = useMemo(
    () => ({ theme: 'stripe' as const }),
    []
  );

  const elementsOptions = useMemo(() => ({
    clientSecret: clientSecret ?? undefined,
    appearance,
    loader: 'auto' as const,
  }), [clientSecret, appearance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Checkout
              </h1>
              <p className="text-xl text-gray-200">
                Complete your purchase securely
              </p>
            </div>
          </div>
        </section>

        {/* Empty Cart State */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-lg text-gray-700 mb-8">
              You need to add items to your cart before proceeding to checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/products')}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Browse Products
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                View Cart
                <ShoppingCart className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          <XCircle className="h-5 w-5 text-white/90" />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white">×</button>
        </div>
      )}

      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Checkout
            </h1>
            <p className="text-xl text-gray-300">
              Complete your purchase securely
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={customerInfo.company}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={customerInfo.state}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={customerInfo.zipCode}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={customerInfo.country}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Mexico">Mexico</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Australia">Australia</option>
                          <option value="Japan">Japan</option>
                          <option value="China">China</option>
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                        <span className="text-sm text-gray-700">
                          Secure payment powered by Stripe
                        </span>
                      </div>

                      {/* Stripe Payment Element */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        {clientSecret ? (
                          <Elements stripe={stripePromise} options={elementsOptions}>
                            <PaymentSection
                              customerInfo={customerInfo}
                              amount={calculateTotal()}
                              onSuccess={(paymentIntentId) => router.push(`/checkout/success?payment_intent_id=${paymentIntentId}`)}
                              onError={(msg) => setToast({ message: msg, type: 'error' })}
                            />
                          </Elements>
                        ) : (
                          <div className="text-sm text-gray-700">
                            {isCreatingIntent ? 'Initializing secure payment...' : 'Unable to initialize payment.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-semibold">${calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      <span>Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-700">
                Your payment information is encrypted and secure
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-700">
                Quick delivery and installation of your equipment
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Returns</h3>
              <p className="text-gray-700">
                Hassle-free returns within 30 days of purchase
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PaymentSection({
  customerInfo,
  amount,
  onSuccess,
  onError,
}: {
  customerInfo: CustomerInfo;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isConfirming, setIsConfirming] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsConfirming(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          receipt_email: customerInfo.email || undefined,
          payment_method_data: {
            billing_details: {
              name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim() || undefined,
              email: customerInfo.email || undefined,
              phone: customerInfo.phone || undefined,
              address: {
                line1: customerInfo.address || undefined,
                city: customerInfo.city || undefined,
                state: customerInfo.state || undefined,
                postal_code: customerInfo.zipCode || undefined,
                country: customerInfo.country || undefined,
              },
            },
          },
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'processing') {
        onError('Payment is processing. You will receive an email confirmation shortly.');
        return;
      }

      onError('Payment could not be completed.');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />

      <button
        type="submit"
        disabled={!stripe || !elements || isConfirming}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
      >
        {isConfirming ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Pay ${amount.toLocaleString()}
          </>
        )}
      </button>
    </form>
  );
} 