'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const products = [
  {
    id: 1,
    name: "Precision Laser Cutter Pro 5000",
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
  const router = useRouter();
  const { addItem, getItemQuantity } = useCart();
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleAddToCart = async (product: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    setLoadingStates(prev => ({ ...prev, [product.id]: true }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });

      // Show success toast
      if ((window as any).showToast) {
        (window as any).showToast(`${product.name} added to cart!`, 'success');
      }
    } catch (error) {
      // Show error toast
      if ((window as any).showToast) {
        (window as any).showToast('Failed to add item to cart', 'error');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Laser Cutting Machinery
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover our range of precision laser cutting solutions for every industrial need.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const currentQuantity = getItemQuantity(product.id);
              const isLoading = loadingStates[product.id] || false;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.inStock && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {product.category}
                    </div>
                    {currentQuantity > 0 && (
                      <div className="absolute bottom-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {currentQuantity} in cart
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price.toLocaleString()}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={!product.inStock || isLoading}
                        className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                          product.inStock && !isLoading
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </>
                        )}
                      </button>
                    </div>

                    {product.inStock && (
                      <p className="text-sm text-gray-700 mt-2">
                        {product.stockCount} units in stock
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 