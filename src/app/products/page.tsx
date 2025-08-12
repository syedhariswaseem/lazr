'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Loader2, Filter } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const products = [
  {
    id: 1,
    name: "Lazr Cutter Pro 5000",
    description: "High-power CO2 laser cutting system with 5000W output for industrial applications",
    price: 125000,
    category: "Industrial",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.8,
    inStock: true,
    stockCount: 5
  },
  {
    id: 2,
    name: "Fiber Laser Cutter Elite 3000",
    description: "Advanced fiber laser technology for precise metal cutting and engraving",
    price: 89000,
    category: "Metal Cutting",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.9,
    inStock: true,
    stockCount: 3
  },
  {
    id: 3,
    name: "Compact Laser Cutter Mini 1000",
    description: "Compact and portable laser cutting solution for small workshops",
    price: 45000,
    category: "Compact",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.6,
    inStock: true,
    stockCount: 8
  },
  {
    id: 4,
    name: "Automated Laser System Max 8000",
    description: "Fully automated laser cutting system with robotic material handling",
    price: 250000,
    category: "Automated",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.9,
    inStock: false,
    stockCount: 0
  },
  {
    id: 5,
    name: "3D Laser Cutter Advanced",
    description: "3D laser cutting and engraving system for complex geometries",
    price: 180000,
    category: "3D Cutting",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.7,
    inStock: true,
    stockCount: 2
  },
  {
    id: 6,
    name: "Water Jet Laser Hybrid",
    description: "Hybrid laser and water jet cutting system for versatile material processing",
    price: 320000,
    category: "Hybrid",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    rating: 4.8,
    inStock: true,
    stockCount: 1
  }
];

const categories = ["All", "Industrial", "Metal Cutting", "Compact", "Automated", "3D Cutting", "Hybrid"];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingStates(prev => ({ ...prev, [product.id]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category
    });
    
    setLoadingStates(prev => ({ ...prev, [product.id]: false }));
    
    // Show success toast
    if ((window as any).showToast) {
      (window as any).showToast(`${product.name} added to cart!`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-yellow-300">Products</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover our range of cutting-edge Lazr solutions for every industrial need.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="h-12 w-12 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                No products found in the "{selectedCategory}" category.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const currentQuantity = getItemQuantity(product.id);
                const isLoading = loadingStates[product.id] || false;

                return (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.category}
                      </div>
                      {currentQuantity > 0 && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {currentQuantity} in cart
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gradient">
                          ${product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock || isLoading}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                          !product.inStock
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : isLoading
                            ? 'bg-blue-600 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 