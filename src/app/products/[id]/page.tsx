'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Star, Truck, Shield, Clock, ArrowLeft, Heart, Share2, CheckCircle, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Mock product data - in a real app, this would come from an API
const products = [
  {
    id: 1,
    name: "Lazr Cutter Pro 5000",
    description: "High-power CO2 laser cutting system with 5000W output for industrial applications. This advanced laser cutting machine delivers exceptional precision and speed for cutting various materials including steel, aluminum, and other metals.",
    longDescription: "The Lazr Cutter Pro 5000 is our flagship industrial laser cutting system designed for high-volume production environments. With its advanced fiber laser technology, this machine can cut through materials up to 25mm thick with exceptional precision and minimal heat-affected zones. The integrated automation features include automatic material handling, real-time monitoring, and predictive maintenance capabilities.",
    price: 125000,
    category: "Industrial",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    stockCount: 5,
    specifications: {
      "Laser Power": "5000W",
      "Cutting Speed": "Up to 50m/min",
      "Material Thickness": "Up to 25mm",
      "Working Area": "6000 x 2000mm",
      "Accuracy": "±0.02mm",
      "Power Consumption": "15kW",
      "Weight": "8,500kg",
      "Dimensions": "12.5 x 3.2 x 2.8m"
    },
    features: [
      "Advanced fiber laser technology",
      "Automatic material handling",
      "Real-time monitoring system",
      "Predictive maintenance",
      "High-speed cutting capability",
      "Precision cutting up to 25mm",
      "Integrated safety systems",
      "Remote monitoring capability"
    ],
    warranty: "3 years comprehensive warranty",
    delivery: "Free installation and training included"
  },
  {
    id: 2,
    name: "Fiber Laser Cutter Elite 3000",
    description: "Advanced fiber laser technology for precise metal cutting and engraving with 3000W power output.",
    longDescription: "The Fiber Laser Cutter Elite 3000 combines cutting-edge fiber laser technology with intuitive controls to deliver exceptional cutting performance. Perfect for both production environments and specialized applications, this machine offers superior beam quality and energy efficiency.",
    price: 89000,
    category: "Metal Cutting",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockCount: 3,
    specifications: {
      "Laser Power": "3000W",
      "Cutting Speed": "Up to 35m/min",
      "Material Thickness": "Up to 15mm",
      "Working Area": "4000 x 1500mm",
      "Accuracy": "±0.03mm",
      "Power Consumption": "10kW",
      "Weight": "5,200kg",
      "Dimensions": "8.5 x 2.8 x 2.5m"
    },
    features: [
      "Fiber laser technology",
      "High beam quality",
      "Energy efficient operation",
      "Easy-to-use interface",
      "Quick setup and calibration",
      "Versatile material compatibility",
      "Low maintenance requirements",
      "Compact footprint"
    ],
    warranty: "2 years comprehensive warranty",
    delivery: "Free installation and training included"
  },
  {
    id: 3,
    name: "Compact Laser Cutter Mini 1000",
    description: "Compact and portable laser cutting solution for small workshops and educational institutions.",
    longDescription: "The Compact Laser Cutter Mini 1000 is designed for small-scale operations, educational institutions, and prototyping needs. Despite its compact size, it delivers professional-grade cutting performance with easy operation and maintenance.",
    price: 45000,
    category: "Compact",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    stockCount: 8,
    specifications: {
      "Laser Power": "1000W",
      "Cutting Speed": "Up to 20m/min",
      "Material Thickness": "Up to 8mm",
      "Working Area": "2000 x 1200mm",
      "Accuracy": "±0.05mm",
      "Power Consumption": "5kW",
      "Weight": "2,800kg",
      "Dimensions": "4.2 x 2.1 x 2.0m"
    },
    features: [
      "Compact design",
      "Easy operation",
      "Low power consumption",
      "Quick setup",
      "Educational friendly",
      "Versatile applications",
      "Portable configuration",
      "Cost-effective solution"
    ],
    warranty: "1 year comprehensive warranty",
    delivery: "Free installation and basic training"
  }
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const productId = parseInt(params.id as string);
    const foundProduct = products.find(p => p.id === productId);
    setProduct(foundProduct);
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, category: product.category });
      if ((window as any).showToast) { (window as any).showToast(`${product.name} added to cart!`, 'success'); }
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
                    <span className="text-gray-700 dark:text-gray-400">({product.reviewCount} reviews)</span>
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
                <p className="text-gray-700 dark:text-gray-300 mb-6">{product.longDescription}</p>

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

              {/* Warranty & Delivery */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Warranty & Delivery</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">{product.warranty}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">{product.delivery}</span>
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