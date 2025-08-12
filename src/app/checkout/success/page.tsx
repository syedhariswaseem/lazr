'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Download, Mail, Phone, Home, Truck, Clock, Shield, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/contexts/CheckoutContext';

interface OrderDetails {
  orderId: string;
  customerName: string;
  email: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const { state: checkoutState, clearCheckoutData } = useCheckout();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fetchedRef = useRef(false);

    useEffect(() => {
    if (fetchedRef.current) return; // prevent double-fetch in dev
    
    // Wait for CheckoutContext to finish loading from localStorage
    if (checkoutState.isLoading) {
      console.log('⏳ Waiting for CheckoutContext to finish loading...');
      return;
    }
    
    fetchedRef.current = true;

    console.log('Success page loaded, checkout state:', checkoutState);
    console.log('localStorage checkout data:', localStorage.getItem('checkoutData'));

    // Check if we have checkout data in context
    if (checkoutState.customerInfo && checkoutState.orderTotal && checkoutState.orderItems) {
      console.log('✅ Using checkout data from context:', checkoutState);
      
      const orderDetails: OrderDetails = {
        orderId: checkoutState.orderId || `ORD-${Date.now().toString().slice(-8).toUpperCase()}`,
        customerName: `${checkoutState.customerInfo.firstName} ${checkoutState.customerInfo.lastName}`,
        email: checkoutState.customerInfo.email,
        total: checkoutState.orderTotal,
        items: checkoutState.orderItems,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Created order details from context:', orderDetails);
      setOrderDetails(orderDetails);
      clearCart();
      return;
    }

    // Fallback: Create order details from cart data
    console.log('⚠️ No checkout context data, using cart fallback');
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    
    const fallbackOrderDetails: OrderDetails = {
      orderId: `ORD-${Date.now().toString().slice(-8).toUpperCase()}`,
      customerName: 'Customer',
      email: 'customer@example.com',
      total,
      items: cartItems.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: new Date().toISOString(),
    };
    
    console.log('Created fallback order details:', fallbackOrderDetails);
    setOrderDetails(fallbackOrderDetails);
    clearCart();
  }, [checkoutState, clearCart]);

  // Clear checkout data only when user navigates away from success page
  useEffect(() => {
    console.log('🔄 Setting up checkout data cleanup...');
    
    const handleBeforeUnload = () => {
      console.log('🧹 Clearing checkout data on page unload');
      clearCheckoutData();
    };

    // Clear data when user leaves the page
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.log('🧹 Cleaning up event listeners');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clearCheckoutData]);

  if (!orderDetails || checkoutState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">
            {checkoutState.isLoading ? 'Loading checkout data...' : 'Loading your order details...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Success Header */}
      <section className="relative overflow-hidden py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Button */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-10">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-green-100 transition-colors duration-200 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2"
              aria-label="Back to Home"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm sm:text-lg font-medium whitespace-nowrap">Back to Home</span>
            </button>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Order Confirmed!
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Thank you for your purchase. Your order has been successfully placed and we're preparing it for shipment.
            </p>
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-white text-lg font-semibold">Order #{orderDetails.orderId}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Order Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Secure Payment</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {orderDetails.items.length > 0 ? (
                    orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">${item.price.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-300">
                      Itemized details not available.
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total Amount</span>
                    <span className="text-2xl text-green-600">${orderDetails.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Name</h3>
                    <p className="text-gray-700 dark:text-gray-300">{orderDetails.customerName}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-700 dark:text-gray-300">{orderDetails.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Order Date</h3>
                    <p className="text-gray-700 dark:text-gray-300">{new Date(orderDetails.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Order Confirmation</h3>
                      <p className="text-blue-100">You'll receive an email confirmation with all order details.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Processing</h3>
                      <p className="text-blue-100">We will prepare your equipment for shipment.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Shipping</h3>
                      <p className="text-blue-100">We'll contact you to arrange delivery and installation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">shharis81@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone Support</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">+92 320 4577888</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">4.9/5 Customer Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">30-Day Return Policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Free Installation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Receipt Button */}
          <div className="mt-16 flex justify-center">
            <button
              onClick={() => window.print()}
              className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Receipt
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 