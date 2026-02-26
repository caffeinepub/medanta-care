import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';
import { useGetOrder } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { OrderStatus } from '../backend';
import OrderProgressTracker from '../components/OrderProgressTracker';
import { formatPrice, formatDate, formatOrderStatus } from '../lib/categoryUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function OrderTrackingPage() {
  const { orderId } = useParams({ from: '/order/$orderId' });
  const { isAuthenticated, login } = useAuth();
  const { data: order, isLoading } = useGetOrder(orderId);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-4">Login to Track Order</h2>
        <Button onClick={login} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">Login</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">This order doesn't exist or you don't have access to it.</p>
        <Link to="/dashboard">
          <Button className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">My Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="bg-medanta-navy py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Track Order</h1>
          <p className="text-white/60 text-xs font-mono mt-1">{order.id}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Status Banner */}
        <div className="bg-medanta-orange/10 border border-medanta-orange/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-medanta-orange font-bold text-lg">{formatOrderStatus(order.status)}</p>
            <p className="text-gray-600 text-sm mt-0.5">
              {order.status === OrderStatus.delivered
                ? 'Your order has been delivered!'
                : 'Estimated delivery: 30–60 minutes'}
            </p>
          </div>
          <div className="text-3xl">
            {order.status === OrderStatus.delivered ? '✅' : '⚡'}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display font-bold text-medanta-navy mb-6">Order Progress</h2>
          <OrderProgressTracker currentStatus={order.status as OrderStatus} />
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display font-bold text-medanta-navy mb-4">Order Details</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-600">Product ID: {item.productId.slice(0, 16)}...</span>
                <span className="font-medium text-medanta-navy">× {item.quantity.toString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2">
              <span className="text-medanta-navy">Total Amount</span>
              <span className="text-medanta-orange text-lg">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-display font-bold text-medanta-navy mb-4">Delivery Information</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-medanta-orange mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Delivery Address</p>
                <p className="text-medanta-navy text-sm">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={16} className="text-medanta-orange flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Payment Method</p>
                <p className="text-medanta-navy text-sm capitalize">{order.paymentMethod}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package size={16} className="text-medanta-orange flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Order Date</p>
                <p className="text-medanta-navy text-sm">{formatDate(order.timestamp)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
