import React, { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { MedicineCategory } from '../backend';
import { useGetAllProducts, useSearchProducts, useGetProductsByCategory } from '../hooks/useQueries';
import { CATEGORY_DISPLAY, ALL_CATEGORIES, getCategoryLabel } from '../lib/categoryUtils';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function CatalogPage() {
  const searchParams = useSearch({ from: '/catalog' });
  const [searchQuery, setSearchQuery] = useState((searchParams as any).search ?? '');
  const [selectedCategory, setSelectedCategory] = useState<MedicineCategory | null>(
    (searchParams as any).category ?? null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allProducts = useGetAllProducts();
  const searchResults = useSearchProducts(searchQuery);
  const categoryProducts = useGetProductsByCategory(selectedCategory);

  const isSearching = searchQuery.trim().length > 0;
  const isFiltering = !!selectedCategory;

  let products = allProducts.data ?? [];
  if (isSearching) products = searchResults.data ?? [];
  else if (isFiltering) products = categoryProducts.data ?? [];

  const isLoading = isSearching
    ? searchResults.isLoading
    : isFiltering
    ? categoryProducts.isLoading
    : allProducts.isLoading;

  const handleCategorySelect = (cat: MedicineCategory | null) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setSidebarOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-medanta-grey">
      {/* Header */}
      <div className="bg-medanta-navy py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-3xl text-white mb-2">Medicine Catalog</h1>
          <p className="text-white/70">Browse 20+ categories of genuine medicines</p>
          <form onSubmit={handleSearch} className="mt-4 relative max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search medicines by name or description..."
              className="w-full pl-4 pr-12 py-3 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medanta-orange text-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-medanta-orange">
              <Search size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-4 sticky top-24">
              <h3 className="font-display font-bold text-medanta-navy mb-4 text-sm uppercase tracking-wide">Categories</h3>
              <button
                onClick={() => handleCategorySelect(null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-1 ${
                  !selectedCategory ? 'bg-medanta-orange text-white' : 'text-gray-600 hover:bg-medanta-grey'
                }`}
              >
                All Categories
              </button>
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-1 flex items-center gap-2 ${
                    selectedCategory === cat ? 'bg-medanta-orange text-white' : 'text-gray-600 hover:bg-medanta-grey'
                  }`}
                >
                  <span>{CATEGORY_DISPLAY[cat].icon}</span>
                  <span className="truncate">{CATEGORY_DISPLAY[cat].label}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="lg:hidden flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm">
                {isSearching ? `Results for "${searchQuery}"` : selectedCategory ? getCategoryLabel(selectedCategory) : 'All Products'}
                {' '}({products.length})
              </p>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium text-gray-700"
              >
                <SlidersHorizontal size={14} />
                Filter
              </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
                <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-medanta-navy">Categories</h3>
                    <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
                  </div>
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium mb-1 ${!selectedCategory ? 'bg-medanta-orange text-white' : 'text-gray-600 hover:bg-medanta-grey'}`}
                  >
                    All Categories
                  </button>
                  {ALL_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium mb-1 flex items-center gap-2 ${selectedCategory === cat ? 'bg-medanta-orange text-white' : 'text-gray-600 hover:bg-medanta-grey'}`}
                    >
                      <span>{CATEGORY_DISPLAY[cat].icon}</span>
                      <span>{CATEGORY_DISPLAY[cat].label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active filters */}
            {(selectedCategory || isSearching) && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">Active filter:</span>
                <span className="flex items-center gap-1 bg-medanta-orange/10 text-medanta-orange text-sm px-3 py-1 rounded-full font-medium">
                  {isSearching ? `"${searchQuery}"` : getCategoryLabel(selectedCategory!)}
                  <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}>
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}

            {/* Desktop count */}
            <p className="hidden lg:block text-gray-500 text-sm mb-4">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <Skeleton className="h-44 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="font-display font-bold text-xl text-medanta-navy mb-2">No products found</h3>
                <p className="text-gray-500">Try a different search term or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
