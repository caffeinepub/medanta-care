import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useGetAllProducts, useDeleteProduct } from '../../hooks/useQueries';
import { type Product, MedicineCategory } from '../../backend';
import { getCategoryLabel, getCategoryIcon, formatPrice } from '../../lib/categoryUtils';
import ProductFormModal from './ProductFormModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductManagementSection() {
  const { data: products, isLoading } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (products ?? []).filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-medanta-navy text-lg">Product Management</h2>
          <p className="text-gray-500 text-sm">{(products ?? []).length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-medanta-orange"
          />
          <Button
            onClick={() => { setEditingProduct(undefined); setModalOpen(true); }}
            className="bg-medanta-orange hover:bg-orange-600 text-white rounded-xl flex items-center gap-2 text-sm"
          >
            <Plus size={14} />
            Add Product
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No products found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-medanta-grey">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rx</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-medanta-grey/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-medanta-navy truncate max-w-[200px]">{product.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">{getCategoryIcon(product.category)} {getCategoryLabel(product.category)}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-medanta-orange">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.stockStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stockStatus ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.requiresPrescription ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.requiresPrescription ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingProduct(product); setModalOpen(true); }}
                        className="p-1.5 text-medanta-purple hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialProduct={editingProduct}
      />
    </div>
  );
}
