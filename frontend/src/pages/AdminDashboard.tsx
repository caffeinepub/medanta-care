import React, { useState } from 'react';
import { Shield, Package, BookOpen, ShoppingBag, Loader2 } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import OrderManagementSection from '../components/admin/OrderManagementSection';
import ProductManagementSection from '../components/admin/ProductManagementSection';
import BlogManagementSection from '../components/admin/BlogManagementSection';
import { Button } from '@/components/ui/button';

type AdminTab = 'orders' | 'products' | 'blogs';

export default function AdminDashboard() {
  const { isAuthenticated, login } = useAuth();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <Shield size={48} className="text-gray-300 mb-4" />
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-4">Admin Login Required</h2>
        <Button onClick={login} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">Login</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-medanta-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const tabs = [
    { key: 'orders' as AdminTab, label: 'Orders', icon: ShoppingBag },
    { key: 'products' as AdminTab, label: 'Products', icon: Package },
    { key: 'blogs' as AdminTab, label: 'Blog Posts', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="bg-medanta-navy py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-medanta-orange flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Admin Dashboard</h1>
            <p className="text-white/60 text-sm">MEDANTA CARE Management Panel</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-card w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-medanta-navy text-white shadow-sm'
                    : 'text-gray-600 hover:text-medanta-navy'
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'orders' && <OrderManagementSection />}
        {activeTab === 'products' && <ProductManagementSection />}
        {activeTab === 'blogs' && <BlogManagementSection />}
      </div>
    </div>
  );
}
