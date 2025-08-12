'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    updateQuantity(id, newQuantity);
    setIsUpdating(prev => ({ ...prev, [id]: false }));
  };

  const handleRemoveItem = async (id: number) => {
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
    removeItem(id);
    setIsUpdating(prev => ({ ...prev, [id]: false }));
  };

  const calculateSubtotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        {/* Header */}
        <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your <span className="text-yellow-300">Cart</span>
            </h1>
            <p className="text-xl text-blue-100">
              Manage your laser cutting machinery selections
            </p>
          </div>
        </section>

        {/* Empty Cart State */}
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Start building your laser cutting solution by exploring our premium products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Browse Products
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Return Home
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your <span className="text-yellow-300">Cart</span>
          </h1>
          <p className="text-xl text-blue-100">
            {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 order-1 lg:order-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Cart Items</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.category}
                          </p>
                          <p className="text-lg lg:text-xl font-bold text-gradient mt-1">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        
                                                {/* Quantity Controls and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Mobile Layout: Quantity and Price on Left, Remove on Right */}
                          <div className="flex items-center justify-between sm:hidden">
                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={isUpdating[item.id]}
                                  className="w-8 h-8 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                                >
                                  <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white px-2">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={isUpdating[item.id]}
                                  className="w-8 h-8 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                                >
                                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </button>
                              </div>
                              
                              {/* Total Price */}
                              <div className="text-left">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  ${(item.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdating[item.id]}
                              className="w-10 h-10 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Desktop Layout: Original Structure */}
                          <div className="hidden sm:flex items-center justify-center sm:justify-start">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={isUpdating[item.id]}
                                className="w-8 h-8 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                              >
                                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </button>
                              <span className="w-12 text-center font-semibold text-gray-900 dark:text-white px-2">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isUpdating[item.id]}
                                className="w-8 h-8 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
                              >
                                <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="hidden sm:flex items-center justify-between sm:justify-end gap-4">
                            <div className="text-right sm:text-left">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isUpdating[item.id]}
                              className="w-10 h-10 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 order-2 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 lg:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Order Summary</h2>
                
                <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${calculateTax().toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 lg:pt-4">
                    <div className="flex justify-between">
                      <span className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-xl lg:text-2xl font-bold text-gradient">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white py-3 lg:py-4 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm lg:text-base"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 lg:py-3 px-4 lg:px-6 rounded-xl font-semibold transition-all duration-300 text-sm lg:text-base"
                  >
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm lg:text-base">What's Included:</h3>
                  <ul className="text-xs lg:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Free installation and training</li>
                    <li>• 3-year comprehensive warranty</li>
                    <li>• 24/7 technical support</li>
                    <li>• Free shipping worldwide</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 