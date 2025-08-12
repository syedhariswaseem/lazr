'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Lock, Truck, Shield, XCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/contexts/CheckoutContext';
import { useTheme } from '@/contexts/ThemeContext';
import countries from 'world-countries';

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
  country: string; // ISO alpha-2 code, e.g., 'US', 'GB'
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  stripe?: string;
}

// Payment Form Component that handles Stripe payment within Elements context
function PaymentForm({ 
  clientSecret, 
  customerInfo, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing,
  validationErrors,
  setValidationErrors,
  stripeElementComplete,
  setStripeElementComplete,
  calculateTotal,
  validateForm,
  scrollToField,
  setCheckoutData,
  setOrderId,
  cartItems
}: {
  clientSecret: string;
  customerInfo: CustomerInfo;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  stripeElementComplete: boolean;
  setStripeElementComplete: (complete: boolean) => void;
  calculateTotal: () => number;
  validateForm: () => boolean;
  scrollToField: (fieldName: string) => void;
  setCheckoutData: (customerInfo: CustomerInfo, orderTotal: number, orderItems: Array<{ name: string; quantity: number; price: number }>) => void;
  setOrderId: (orderId: string) => void;
  cartItems: Array<{ id: number; name: string; quantity: number; price: number; imageUrl: string }>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePlaceOrder = async () => {
    // Clear previous errors
    setValidationErrors({});
    
    // Validate form fields first
    if (!validateForm()) {
      // Find first error and scroll to it
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        scrollToField(firstErrorField);
      }
      return;
    }

    // Check if Stripe element is complete
    if (!stripeElementComplete) {
      setValidationErrors(prev => ({ ...prev, stripe: 'Please complete your payment details' }));
      return;
    }

    if (!stripe || !elements) {
      onError('Stripe not initialized');
      return;
    }

    // Store checkout data BEFORE payment processing
    console.log('💾 Storing checkout data before payment...');
    setCheckoutData(customerInfo, calculateTotal(), cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })));
    
    // Set a temporary order ID
    setOrderId(`temp_${Date.now()}`);

    setIsProcessing(true);

    try {
      // Submit the elements first (required by Stripe)
      const { error: submitError } = await elements.submit();
      if (submitError) {
        onError(submitError.message || 'Payment validation failed');
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
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

      if (result.error) {
        console.error('❌ Stripe payment error:', result.error);
        onError(result.error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (result.paymentIntent) {
        const paymentIntent = result.paymentIntent;
        
        if (paymentIntent.status === 'succeeded') {
          onSuccess(paymentIntent.id);
          return;
        }

        if (paymentIntent.status === 'processing') {
          onError('Payment is processing. You will receive an email confirmation shortly.');
          setIsProcessing(false);
          return;
        }
      }

      onError('Payment could not be completed.');
      setIsProcessing(false);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to process order');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Stripe Validation Error - Above PaymentElement */}
      {validationErrors.stripe && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.stripe}</p>
        </div>
      )}
      
      <PaymentElement 
        options={{ 
          layout: 'tabs', 
          paymentMethodOrder: ['card'],
          wallets: { applePay: 'never', googlePay: 'never' },
          fields: {
            billingDetails: {
              name: 'never',
              email: 'never',
              phone: 'never',
              address: 'never',
            },
          },
        }} 
        onChange={(event) => {
          setStripeElementComplete(event.complete);
          if (validationErrors.stripe) {
            setValidationErrors(prev => ({
              ...prev,
              stripe: undefined
            }));
          }
        }}
      />
      
      {/* Single Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl mt-4 text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Place Order - ${calculateTotal().toLocaleString()}
          </>
        )}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state } = useCart();
  const { items: cartItems } = state;
  const { theme } = useTheme();
  const { setCheckoutData, setOrderId } = useCheckout();
  
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
    country: 'US'
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [stripeElementComplete, setStripeElementComplete] = useState(false);

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
        console.log('🔧 Creating payment intent with:', {
          items: cartItems,
          customerInfo,
          amount: calculateTotal(),
        });
        
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems,
            customerInfo,
            amount: calculateTotal(),
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Payment intent creation failed:', response.status, errorText);
          throw new Error(`Failed to initialize payment: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Payment intent created, client secret received');
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

  const appearance = useMemo(() => {
    if (theme === 'dark') {
      return {
        theme: 'night' as const,
        variables: {
          colorBackground: '#0f172a',
          colorText: '#ffffff',
          colorTextSecondary: '#cbd5e1',
          colorPrimary: '#7c3aed',
          colorDanger: '#ef4444',
          borderRadius: '12px',
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        },
        rules: {
          '.Input': {
            backgroundColor: '#111827',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
          '.Input:focus': {
            border: '1px solid #7c3aed',
          },
          '.Label': {
            color: '#e5e7eb',
          },
          '.Tab, .Block': {
            backgroundColor: '#0f172a',
            color: '#e5e7eb',
            borderColor: '#374151',
          },
          '.Tab--selected, .Block--selected': {
            backgroundColor: '#111827',
            color: '#ffffff',
          },
          '.Error': {
            color: '#fca5a5',
          },
        },
      };
    }

    return {
      theme: 'stripe' as const,
      variables: {
        colorBackground: '#ffffff',
        colorText: '#0f172a',
        colorTextSecondary: '#6b7280',
        colorPrimary: '#2563eb',
        borderRadius: '12px',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      },
      rules: {
        '.Input': {
          backgroundColor: '#f9fafb',
          color: '#111827',
          border: '1px solid #e5e7eb',
        },
        '.Input:focus': {
          border: '1px solid #2563eb',
        },
        '.Label': {
          color: '#374151',
        },
      },
    };
  }, [theme]);

  const elementsOptions = useMemo(() => ({
    clientSecret: clientSecret ?? undefined,
    appearance,
    loader: 'auto' as const,
  }), [clientSecret, appearance]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Required field validation
    if (!customerInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!customerInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!customerInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!customerInfo.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!customerInfo.city.trim()) {
      errors.city = 'City is required';
    }
    if (!customerInfo.state.trim()) {
      errors.state = 'State is required';
    }
    if (!customerInfo.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    if (!customerInfo.country.trim()) {
      errors.country = 'Country is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const scrollToField = (fieldName: string) => {
    const element = document.querySelector(`[name="${fieldName}"]`);
    if (element) {
      // Add a small delay for smoother animation
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        // Focus the element after scrolling
        setTimeout(() => {
          (element as HTMLElement).focus();
          // Add a subtle highlight effect
          element.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50');
          }, 2000);
        }, 300);
      }, 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('🎉 Payment successful, storing checkout data:', {
      customerInfo,
      total: calculateTotal(),
      items: cartItems
    });
    
    // Store checkout data in Redux context
    setCheckoutData(customerInfo, calculateTotal(), cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })));
    
    // Set the order ID
    setOrderId(paymentIntentId);
    
    // Small delay to ensure data is stored before redirect
    setTimeout(() => {
      console.log('🚀 Redirecting to success page...');
      router.push('/checkout/success');
    }, 100);
  };

  const handlePaymentError = (message: string) => {
    setToast({ message, type: 'error' });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Checkout
              </h1>
              <p className="text-xl text-blue-100">
                Complete your purchase securely
              </p>
            </div>
          </div>
        </section>

        {/* Empty Cart State */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-500 dark:text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              You need to add items to your cart before proceeding to checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Browse Products
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          <XCircle className="h-5 w-5 text-white/90" />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white">×</button>
        </div>
      )}

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Checkout
            </h1>
            <p className="text-xl text-blue-100">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={customerInfo.firstName}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                            validationErrors.firstName 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        />
                        {validationErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={customerInfo.lastName}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                            validationErrors.lastName 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        />
                        {validationErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={customerInfo.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                            validationErrors.email 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        />
                        {validationErrors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={customerInfo.phone}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                            validationErrors.phone 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        />
                        {validationErrors.phone && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.phone}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={customerInfo.company}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={customerInfo.address}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                            validationErrors.address 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        />
                        {validationErrors.address && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.address}</p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={customerInfo.city}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                              validationErrors.city 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          />
                          {validationErrors.city && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={customerInfo.state}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                              validationErrors.state 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          />
                          {validationErrors.state && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.state}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={customerInfo.zipCode}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                              validationErrors.zipCode 
                                ? 'border-red-500 focus:ring-red-500' 
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          />
                          {validationErrors.zipCode && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.zipCode}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={customerInfo.country}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white ${
                            validationErrors.country 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          {countries
                            .map((c) => ({ code: c.cca2, name: c.name.common }))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(({ code, name }) => (
                              <option key={code} value={code}>
                                {name}
                              </option>
                            ))}
                        </select>
                        {validationErrors.country && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.country}</p>
                        )}
                      </div>
                    </div>
                  </div>

                                    {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
                    

                    
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Secure payment powered by Stripe
                        </span>
                      </div>



                      {/* Stripe Payment Element */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        {clientSecret ? (
                          <Elements stripe={stripePromise} options={elementsOptions}>
                            <PaymentForm
                              clientSecret={clientSecret}
                              customerInfo={customerInfo}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                              isProcessing={isProcessing}
                              setIsProcessing={setIsProcessing}
                              validationErrors={validationErrors}
                              setValidationErrors={setValidationErrors}
                              stripeElementComplete={stripeElementComplete}
                              setStripeElementComplete={setStripeElementComplete}
                              calculateTotal={calculateTotal}
                              validateForm={validateForm}
                              scrollToField={scrollToField}
                              setCheckoutData={setCheckoutData}
                              setOrderId={setOrderId}
                              cartItems={cartItems}
                            />
                          </Elements>
                        ) : (
                          <div className="text-sm text-gray-700 dark:text-gray-300">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">${calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-2xl font-bold text-gradient">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
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
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Payment</h3>
              <p className="text-gray-700 dark:text-gray-400">
                Your payment information is encrypted and secure
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-700 dark:text-gray-400">
                Quick delivery and installation of your equipment
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">30-Day Returns</h3>
              <p className="text-gray-700 dark:text-gray-400">
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
      <PaymentElement 
        options={{ 
          layout: 'tabs', 
          paymentMethodOrder: ['card'],
          wallets: { applePay: 'never', googlePay: 'never' },
          fields: {
            billingDetails: {
              name: 'never',
              email: 'never',
              phone: 'never',
              address: 'never',
            },
          },
        }} 
      />

      <button
        type="submit"
        disabled={!stripe || !elements || isConfirming}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
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