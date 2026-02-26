import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Package, MapPin, FileText, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGetCallerUserProfile, useGetUserOrders, useDeleteAddress } from '../hooks/useQueries';
import { formatPrice, formatDate, formatOrderStatus } from '../lib/categoryUtils';
import { OrderStatus, type Address } from '../backend';
import OrderProgressTracker from '../components/OrderProgressTracker';
import AddressFormModal from '../components/AddressFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type Tab = 'orders' | 'addresses' | 'prescriptions';

const STATUS_COLORS: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700',
  verified: 'bg-yellow-100 text-yellow-700',
  packed: 'bg-orange-100 text-orange-700',
  outForDelivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function CustomerDashboard() {
  const { isAuthenticated, login } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: orders, isLoading: ordersLoading } = useGetUserOrders();
  const deleteAddress = useDeleteAddress();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <User size={48} className="text-gray-300 mb-4" />
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Login Required</h2>
        <p className="text-gray-500 mb-6">Please login to view your dashboard</p>
        <Button onClick={login} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">
          Login
        </Button>
      </div>
    );
  }

  const tabs = [
    { key: 'orders' as Tab, label: 'Order History', icon: Package },
    { key: 'addresses' as Tab, label: 'Saved Addresses', icon: MapPin },
    { key: 'prescriptions' as Tab, label: 'Prescriptions', icon: FileText },
  ];

  const ordersWithPrescriptions = (orders ?? []).filter(o => o.prescription);

  return (
    <div className="min-h-screen bg-medanta-grey">
      {/* Header */}
      <div className="bg-medanta-navy py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-medanta-orange flex items-center justify-center text-white font-bold text-xl">
              {userProfile?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white">
                {profileLoading ? 'Loading...' : userProfile?.name ?? 'My Dashboard'}
              </h1>
              <p className="text-white/70 text-sm">{userProfile?.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-card w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-medanta-navy text-white shadow-sm'
                    : 'text-gray-600 hover:text-medanta-navy'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
            ) : !orders || orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-medanta-navy mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                <Link to="/catalog" search={{ search: '', category: '' }}>
                  <Button className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full">Browse Medicines</Button>
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-medanta-grey/50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-mono text-xs text-gray-400 mb-1">{order.id.slice(0, 20)}...</p>
                        <p className="font-semibold text-medanta-navy text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        <p className="text-gray-400 text-xs">{formatDate(order.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {formatOrderStatus(order.status)}
                      </span>
                      <span className="font-bold text-medanta-orange">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                  {expandedOrder === order.id && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="mt-4 mb-4">
                        <OrderProgressTracker currentStatus={order.status as OrderStatus} />
                      </div>
                      <p className="text-xs text-gray-500 mb-3">
                        <span className="font-semibold">Delivery:</span> {order.deliveryAddress}
                      </p>
                      <Link to="/order/$orderId" params={{ orderId: order.id }}>
                        <Button size="sm" variant="outline" className="rounded-full border-medanta-orange text-medanta-orange hover:bg-orange-50 text-xs">
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Addresses */}
        {activeTab === 'addresses' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-medanta-navy">Saved Addresses</h2>
              <Button
                onClick={() => { setEditingAddress(undefined); setAddressModalOpen(true); }}
                className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full text-sm"
              >
                + Add Address
              </Button>
            </div>
            {profileLoading ? (
              <Skeleton className="h-32 rounded-2xl" />
            ) : !userProfile?.addresses || userProfile.addresses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-medanta-navy mb-2">No Saved Addresses</h3>
                <p className="text-gray-500">Add a delivery address for faster checkout</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {userProfile.addresses.map((addr, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-card p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className="bg-medanta-navy text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {addr.addressLabel}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingAddress(addr); setAddressModalOpen(true); }}
                          className="text-xs text-medanta-purple hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAddress.mutate(addr)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-medanta-navy font-medium text-sm">{addr.address}</p>
                    <p className="text-gray-500 text-xs mt-1">{addr.city} - {addr.pincode.toString()}</p>
                  </div>
                ))}
              </div>
            )}
            <AddressFormModal
              open={addressModalOpen}
              onClose={() => setAddressModalOpen(false)}
              initialAddress={editingAddress}
            />
          </div>
        )}

        {/* Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div>
            <h2 className="font-display font-bold text-xl text-medanta-navy mb-4">Prescription History</h2>
            {ordersLoading ? (
              <Skeleton className="h-32 rounded-2xl" />
            ) : ordersWithPrescriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-medanta-navy mb-2">No Prescriptions</h3>
                <p className="text-gray-500">Prescriptions uploaded with your orders will appear here</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ordersWithPrescriptions.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                    <div className="h-40 bg-medanta-grey flex items-center justify-center overflow-hidden">
                      {order.prescription && (
                        <img
                          src={order.prescription.getDirectURL()}
                          alt="Prescription"
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 font-mono mb-1">{order.id.slice(0, 16)}...</p>
                      <p className="text-xs text-gray-500">{formatDate(order.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
