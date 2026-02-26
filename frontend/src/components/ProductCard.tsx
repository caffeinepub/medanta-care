import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingCart, FileText } from 'lucide-react';
import { type Product } from '../backend';
import { useCart } from '../hooks/useCart';
import { getCategoryLabel, getCategoryIcon, formatPrice } from '../lib/categoryUtils';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <Link to="/product/$id" params={{ id: product.id }}>
        <div className="relative h-44 bg-medanta-grey overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => { (e.target as HTMLImageElement).src = '/assets/generated/icon-authentic.dim_80x80.png'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">{getCategoryIcon(product.category)}</span>
            </div>
          )}
          {product.requiresPrescription && (
            <div className="absolute top-2 right-2 bg-medanta-purple text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <FileText size={10} />
              Rx
            </div>
          )}
          {!product.stockStatus && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-medanta-purple font-medium bg-purple-50 px-2 py-0.5 rounded-full">
            {getCategoryIcon(product.category)} {getCategoryLabel(product.category)}
          </span>
        </div>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-display font-semibold text-medanta-navy text-sm leading-tight mb-1 hover:text-medanta-orange transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-medanta-orange text-lg">{formatPrice(product.price)}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={!product.stockStatus}
            className="flex items-center gap-1.5 bg-medanta-navy text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-medanta-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
