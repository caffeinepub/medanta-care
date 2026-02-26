import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Product, MedicineCategory } from '../../backend';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useQueries';
import { CATEGORY_DISPLAY, ALL_CATEGORIES } from '../../lib/categoryUtils';
import { Loader2 } from 'lucide-react';

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  initialProduct?: Product;
}

export default function ProductFormModal({ open, onClose, initialProduct }: ProductFormModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MedicineCategory>(MedicineCategory.general);
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [stockStatus, setStockStatus] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setDescription(initialProduct.description);
      setPrice(initialProduct.price.toString());
      setCategory(initialProduct.category);
      setRequiresPrescription(initialProduct.requiresPrescription);
      setStockStatus(initialProduct.stockStatus);
      setImageUrl(initialProduct.imageUrl);
    } else {
      setName(''); setDescription(''); setPrice(''); setCategory(MedicineCategory.general);
      setRequiresPrescription(false); setStockStatus(true); setImageUrl('');
    }
  }, [initialProduct, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return;
    if (initialProduct) {
      await updateProduct.mutateAsync({ id: initialProduct.id, name, description, price: priceNum, category, requiresPrescription, stockStatus, imageUrl });
    } else {
      await createProduct.mutateAsync({ name, description, price: priceNum, category, requiresPrescription, stockStatus, imageUrl });
    }
    onClose();
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-medanta-navy">
            {initialProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Product Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} required className="mt-1" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={category} onValueChange={val => setCategory(val as MedicineCategory)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_DISPLAY[cat].icon} {CATEGORY_DISPLAY[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={requiresPrescription} onCheckedChange={v => setRequiresPrescription(!!v)} />
              <span className="text-sm font-medium">Requires Prescription</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={stockStatus} onCheckedChange={v => setStockStatus(!!v)} />
              <span className="text-sm font-medium">In Stock</span>
            </label>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full">
              {isPending ? <><Loader2 size={14} className="animate-spin mr-1" />Saving...</> : initialProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
