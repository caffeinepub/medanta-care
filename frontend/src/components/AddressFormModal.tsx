import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Address } from '../backend';
import { useAddAddress, useUpdateAddress } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  initialAddress?: Address;
}

export default function AddressFormModal({ open, onClose, initialAddress }: AddressFormModalProps) {
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();

  useEffect(() => {
    if (initialAddress) {
      setLabel(initialAddress.addressLabel);
      setAddress(initialAddress.address);
      setCity(initialAddress.city);
      setPincode(initialAddress.pincode.toString());
    } else {
      setLabel(''); setAddress(''); setCity(''); setPincode('');
    }
    setErrors({});
  }, [initialAddress, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!label.trim()) errs.label = 'Label is required';
    if (!address.trim()) errs.address = 'Address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!pincode.trim()) errs.pincode = 'Pincode is required';
    if (pincode && !/^\d{6}$/.test(pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const newAddr: Address = {
      addressLabel: label.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: BigInt(pincode),
    };
    if (initialAddress) {
      await updateAddress.mutateAsync({ oldAddress: initialAddress, newAddress: newAddr });
    } else {
      await addAddress.mutateAsync(newAddr);
    }
    onClose();
  };

  const isPending = addAddress.isPending || updateAddress.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-medanta-navy">
            {initialAddress ? 'Edit Address' : 'Add New Address'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="addr-label">Label (e.g., Home, Office)</Label>
            <Input id="addr-label" value={label} onChange={e => setLabel(e.target.value)} placeholder="Home" className="mt-1" />
            {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label}</p>}
          </div>
          <div>
            <Label htmlFor="addr-address">Full Address</Label>
            <Input id="addr-address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, Area, Landmark" className="mt-1" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="addr-city">City</Label>
              <Input id="addr-city" value={city} onChange={e => setCity(e.target.value)} placeholder="Varanasi" className="mt-1" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="addr-pincode">Pincode</Label>
              <Input id="addr-pincode" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="221001" className="mt-1" />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full">
              {isPending ? <><Loader2 size={14} className="animate-spin mr-1" />Saving...</> : 'Save Address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
