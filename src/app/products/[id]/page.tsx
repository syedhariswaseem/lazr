'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, Truck, Shield, Clock, ArrowLeft, Heart, Share2, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  rating: number;
  inStock: boolean;
  stockCount: number;
  createdAt: string;
  updatedAt: string;
  // Optional fields for UI compatibility
  reviewCount?: number;
  longDescription?: string;
  specifications?: Record<string, string>;
  features?: string[];
  warranty?: string;
  delivery?: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = params.id as string;
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, { cache: 'no-store' });
        if (!res.ok) return setProduct(null);
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      }
    };
    load();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, category: product.category });
      if ((window as unknown as { showToast?: (message: string, type: string) => void }).showToast) {
        (window as unknown as { showToast: (message: string, type: string) => void }).showToast(`${product.name} added to cart!`, 'success'); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading product details...</p>
        </div>
      </div>
    );
  }

  const currentQuantity = getItemQuantity(product.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Products
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-96 object-cover" />
              </div>
              <div className="flex space-x-4">
                {[1, 2, 3, 4].map((index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index - 1)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === index - 1 ? 'border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <img src={product.imageUrl} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                    </div>
                    <span className="text-gray-700 dark:text-gray-400">({product.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{product.longDescription || product.description}</p>

                <div className="text-4xl font-bold text-gradient mb-6">
                  ${product.price.toLocaleString()}
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2 mb-6">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">In Stock</span>
                      <span className="text-gray-700 dark:text-gray-400">({product.stockCount} available)</span>
                    </>
                  ) : (
                    <>
                      <div className="h-5 w-5 bg-red-600 rounded-full"></div>
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</label>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors border border-gray-300 dark:border-gray-600">
                        <span className="text-gray-700 dark:text-gray-300">-</span>
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors border border-gray-300 dark:border-gray-600">
                        <span className="text-gray-700 dark:text-gray-300">+</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${!product.inStock ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' : isLoading ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </>
                    )}
                  </button>

                  {currentQuantity > 0 && (
                    <div className="text-center">
                      <span className="text-green-600 font-medium">
                        {currentQuantity} in cart
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty & Delivery */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Warranty & Delivery</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">{product.warranty || '1 year comprehensive warranty'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">{product.delivery || 'Free installation and training included'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700 dark:text-gray-300">Estimated delivery: 5-7 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Technical Specifications</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{key}</dt>
                      <dd className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{value as string}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Related Products */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Products</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => p.id !== product.id)
                .slice(0, 3)
                .map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                    onClick={() => router.push(`/products/${relatedProduct.id}`)}
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700">
                      <img src={relatedProduct.imageUrl} alt={relatedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {relatedProduct.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ${relatedProduct.price.toLocaleString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 