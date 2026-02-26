import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice, getCategoryIcon } from '../lib/categoryUtils';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-medanta-grey flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Add medicines to your cart to get started</p>
        <Link to="/catalog" search={{ search: '', category: '' }}>
          <Button className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">
            Browse Medicines
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="bg-medanta-navy py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-3xl text-white">Your Cart</h1>
          <p className="text-white/70 mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-medanta-grey flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-3xl">{getCategoryIcon(item.product.category)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to="/product/$id" params={{ id: item.product.id }}>
                    <h3 className="font-display font-semibold text-medanta-navy text-sm hover:text-medanta-orange transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-medanta-orange font-bold mt-1">{formatPrice(item.product.price)}</p>
                  {item.product.requiresPrescription && (
                    <span className="text-xs text-medanta-purple bg-purple-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Rx Required
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-medanta-grey transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-medanta-grey transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-medanta-navy">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-display font-bold text-medanta-navy text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium text-medanta-navy flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-medanta-navy">Total</span>
                  <span className="font-display font-black text-xl text-medanta-orange">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Delivery charges may apply</p>
              </div>
              <Button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full bg-medanta-orange hover:bg-orange-600 text-white rounded-full font-bold py-3 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Button>
              <Link to="/catalog" search={{ search: '', category: '' }}>
                <button className="w-full mt-3 text-gray-500 hover:text-medanta-navy text-sm py-2 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
