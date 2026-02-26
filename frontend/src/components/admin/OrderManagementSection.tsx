import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useGetUserOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { OrderStatus } from '../../backend';
import { formatPrice, formatDate, formatOrderStatus } from '../../lib/categoryUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS = [
  { value: OrderStatus.received, label: 'Received' },
  { value: OrderStatus.verified, label: 'Verified' },
  { value: OrderStatus.packed, label: 'Packed' },
  { value: OrderStatus.outForDelivery, label: 'Out for Delivery' },
  { value: OrderStatus.delivered, label: 'Delivered' },
];

const STATUS_COLORS: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700',
  verified: 'bg-yellow-100 text-yellow-700',
  packed: 'bg-orange-100 text-orange-700',
  outForDelivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function OrderManagementSection() {
  const { data: orders, isLoading } = useGetUserOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrder(orderId);
    try {
      await updateStatus.mutateAsync({ orderId, status });
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-12 text-center">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-display font-bold text-medanta-navy text-lg">Order Management</h2>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>
      <div className="divide-y divide-gray-50">
        {orders.map(order => (
          <div key={order.id}>
            <div
              className="p-4 flex items-center gap-4 hover:bg-medanta-grey/30 cursor-pointer transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-gray-400 truncate">{order.id}</p>
                <p className="text-sm font-semibold text-medanta-navy mt-0.5">{order.items.length} item(s) · {formatDate(order.timestamp)}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {formatOrderStatus(order.status)}
              </span>
              <span className="font-bold text-medanta-orange flex-shrink-0">{formatPrice(order.totalAmount)}</span>
              <div className="flex-shrink-0">
                {expandedOrder === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>
            {expandedOrder === order.id && (
              <div className="px-4 pb-4 bg-medanta-grey/20 border-t border-gray-100">
                <div className="pt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Items</p>
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-medanta-navy">• {item.productId.slice(0, 20)}... × {item.quantity.toString()}</p>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-semibold">Address:</span> {order.deliveryAddress}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">Payment:</span> {order.paymentMethod}
                    </p>
                  </div>
                  <div>
                    {order.prescription && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prescription</p>
                        <img
                          src={order.prescription.getDirectURL()}
                          alt="Prescription"
                          className="w-32 h-24 object-cover rounded-xl border border-gray-200"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Update Status</p>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={val => handleStatusChange(order.id, val as OrderStatus)}
                        disabled={updatingOrder === order.id}
                      >
                        <SelectTrigger className="w-48 text-sm rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingOrder === order.id && <Loader2 size={16} className="animate-spin text-medanta-orange" />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
