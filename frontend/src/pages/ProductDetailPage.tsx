import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ShoppingCart, FileText, ArrowLeft, Plus, Minus, CheckCircle } from 'lucide-react';
import { useGetProduct } from '../hooks/useQueries';
import { useCart } from '../hooks/useCart';
import { getCategoryLabel, getCategoryIcon, formatPrice } from '../lib/categoryUtils';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/product/$id' });
  const { data: product, isLoading } = useGetProduct(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">💊</div>
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">This product doesn't exist or has been removed.</p>
        <Link to="/catalog" search={{ search: '', category: '' }}>
          <button className="bg-medanta-orange text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all">
            Back to Catalog
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-medanta-orange transition-colors">Home</Link>
          <span>/</span>
          <Link to="/catalog" search={{ search: '', category: '' }} className="hover:text-medanta-orange transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-medanta-navy font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-medanta-grey flex items-center justify-center min-h-72 p-8">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-64 w-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="text-8xl">{getCategoryIcon(product.category)}</div>
              )}
              {product.requiresPrescription && (
                <div className="absolute top-4 right-4 bg-medanta-purple text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                  <FileText size={12} />
                  Prescription Required
                </div>
              )}
              {!product.stockStatus && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="bg-white text-gray-700 font-bold px-4 py-2 rounded-full">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8">
              <div className="mb-3">
                <span className="text-xs text-medanta-purple font-semibold bg-purple-50 px-3 py-1 rounded-full">
                  {getCategoryIcon(product.category)} {getCategoryLabel(product.category)}
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl text-medanta-navy mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display font-black text-3xl text-medanta-orange">{formatPrice(product.price)}</span>
                <span className="text-gray-400 text-sm">per unit</span>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${product.stockStatus ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stockStatus ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stockStatus ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Prescription notice */}
              {product.requiresPrescription && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <FileText size={16} className="text-medanta-purple mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-medanta-purple font-semibold text-sm">Prescription Required</p>
                      <p className="text-purple-600 text-xs mt-1">
                        This medicine requires a valid prescription. You'll be asked to upload it during checkout.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              {product.stockStatus && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-medanta-grey transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold text-medanta-navy">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-medanta-grey transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.stockStatus}
                className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-full text-base transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-medanta-orange text-white hover:opacity-90 shadow-orange hover:shadow-xl'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <><CheckCircle size={18} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={18} /> {product.requiresPrescription ? 'Add to Cart (Rx Required)' : 'Add to Cart'}</>
                )}
              </button>

              <Link to="/catalog" search={{ search: '', category: '' }}>
                <button className="w-full mt-3 flex items-center justify-center gap-2 text-gray-500 hover:text-medanta-navy text-sm py-2 transition-colors">
                  <ArrowLeft size={14} />
                  Back to Catalog
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
