import React, { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { CheckCircle, ArrowLeft, ArrowRight, Loader2, MapPin, FileText, CreditCard, Package } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useGetCallerUserProfile, usePlaceOrder, useAddAddress } from '../hooks/useQueries';
import { PaymentMethod, ExternalBlob, type Address, type OrderItem } from '../backend';
import { formatPrice } from '../lib/categoryUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'address' | 'prescription' | 'payment' | 'confirmation';

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: 'address', label: 'Delivery Address', icon: MapPin },
  { key: 'prescription', label: 'Prescription', icon: FileText },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'confirmation', label: 'Confirmation', icon: Package },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { data: userProfile } = useGetCallerUserProfile();
  const placeOrder = usePlaceOrder();
  const addAddress = useAddAddress();

  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: 'Varanasi', pincode: '' });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.cod);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState('');

  const total = getCartTotal();
  const requiresPrescription = cartItems.some(item => item.product.requiresPrescription);
  const addresses = userProfile?.addresses ?? [];

  const stepIndex = STEPS.findIndex(s => s.key === currentStep);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-medanta-grey flex items-center justify-center mb-6">
          <CreditCard size={36} className="text-gray-400" />
        </div>
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Login Required</h2>
        <p className="text-gray-500 mb-6">Please login to proceed with checkout</p>
        <Button onClick={login} className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">
          Login to Continue
        </Button>
      </div>
    );
  }

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Your cart is empty</h2>
        <Link to="/catalog" search={{ search: '', category: '' }}>
          <Button className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8 mt-4">
            Browse Medicines
          </Button>
        </Link>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPrescriptionFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPrescriptionPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const getDeliveryAddress = (): string => {
    if (useNewAddress) {
      return `${newAddress.address}, ${newAddress.city} - ${newAddress.pincode}`;
    }
    if (selectedAddressIndex !== null && addresses[selectedAddressIndex]) {
      const a = addresses[selectedAddressIndex];
      return `${a.address}, ${a.city} - ${a.pincode}`;
    }
    return '';
  };

  const handlePlaceOrder = async () => {
    const deliveryAddress = getDeliveryAddress();
    if (!deliveryAddress) return;

    const items: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      quantity: BigInt(item.quantity),
    }));

    let prescriptionBlob: ExternalBlob | null = null;
    if (prescriptionFile) {
      const buffer = await prescriptionFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      prescriptionBlob = ExternalBlob.fromBytes(bytes).withUploadProgress(pct => setUploadProgress(pct));
    }

    // Save new address if entered
    if (useNewAddress && newAddress.address && newAddress.pincode) {
      try {
        await addAddress.mutateAsync({
          addressLabel: newAddress.label || 'Home',
          address: newAddress.address,
          city: newAddress.city,
          pincode: BigInt(newAddress.pincode),
        });
      } catch {
        // ignore address save error, still place order
      }
    }

    const id = await placeOrder.mutateAsync({
      items,
      deliveryAddress,
      paymentMethod,
      prescription: prescriptionBlob,
    });

    setOrderId(id);
    clearCart();
    setCurrentStep('confirmation');
  };

  const handleNextStep = () => {
    if (currentStep === 'address') {
      if (!useNewAddress && selectedAddressIndex === null && addresses.length > 0) {
        setAddressError('Please select a delivery address');
        return;
      }
      if (useNewAddress && (!newAddress.address || !newAddress.pincode)) {
        setAddressError('Please fill in the address details');
        return;
      }
      setAddressError('');
      setCurrentStep('prescription');
    } else if (currentStep === 'prescription') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handlePlaceOrder();
    }
  };

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="bg-medanta-navy py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-3xl text-white mb-6">Checkout</h1>
          {/* Progress Steps */}
          <div className="flex items-center gap-0">
            {STEPS.map((step, i) => {
              const isCompleted = i < stepIndex;
              const isCurrent = i === stepIndex;
              const Icon = step.icon;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted ? 'bg-medanta-orange border-medanta-orange text-white' :
                      isCurrent ? 'bg-white border-medanta-orange text-medanta-orange' :
                      'bg-white/20 border-white/30 text-white/50'
                    }`}>
                      {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
                    </div>
                    <span className={`text-xs mt-1 hidden sm:block ${isCurrent ? 'text-white font-semibold' : 'text-white/60'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-medanta-orange' : 'bg-white/20'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">

          {/* Step 1: Address */}
          {currentStep === 'address' && (
            <div>
              <h2 className="font-display font-bold text-xl text-medanta-navy mb-6">Delivery Address</h2>
              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr, i) => (
                    <label key={i} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressIndex === i && !useNewAddress ? 'border-medanta-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressIndex === i && !useNewAddress}
                        onChange={() => { setSelectedAddressIndex(i); setUseNewAddress(false); }}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-semibold text-medanta-navy text-sm">{addr.addressLabel}</p>
                        <p className="text-gray-600 text-sm">{addr.address}</p>
                        <p className="text-gray-500 text-xs">{addr.city} - {addr.pincode.toString()}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all mb-4 ${
                useNewAddress ? 'border-medanta-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200'
              }`}>
                <input
                  type="radio"
                  name="address"
                  checked={useNewAddress}
                  onChange={() => { setUseNewAddress(true); setSelectedAddressIndex(null); }}
                />
                <span className="font-semibold text-medanta-navy text-sm">+ Add New Address</span>
              </label>
              {useNewAddress && (
                <div className="space-y-3 pl-4 border-l-2 border-medanta-orange ml-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Label</Label>
                      <Input value={newAddress.label} onChange={e => setNewAddress(a => ({ ...a, label: e.target.value }))} placeholder="Home" className="mt-1" />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Full Address *</Label>
                    <Input value={newAddress.address} onChange={e => setNewAddress(a => ({ ...a, address: e.target.value }))} placeholder="Street, Area, Landmark" className="mt-1" />
                  </div>
                  <div>
                    <Label>Pincode *</Label>
                    <Input value={newAddress.pincode} onChange={e => setNewAddress(a => ({ ...a, pincode: e.target.value }))} placeholder="221001" className="mt-1" />
                  </div>
                </div>
              )}
              {addressError && <p className="text-red-500 text-sm mt-2">{addressError}</p>}
            </div>
          )}

          {/* Step 2: Prescription */}
          {currentStep === 'prescription' && (
            <div>
              <h2 className="font-display font-bold text-xl text-medanta-navy mb-2">Upload Prescription</h2>
              {requiresPrescription ? (
                <>
                  <p className="text-gray-500 text-sm mb-6">
                    One or more items in your cart require a prescription. Please upload a clear photo of your prescription.
                  </p>
                  <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                    prescriptionPreview ? 'border-medanta-orange bg-orange-50' : 'border-gray-200 hover:border-medanta-orange'
                  }`}>
                    {prescriptionPreview ? (
                      <div>
                        <img src={prescriptionPreview} alt="Prescription preview" className="max-h-48 mx-auto rounded-xl mb-4 object-contain" />
                        <p className="text-green-600 font-semibold text-sm mb-2">✅ Prescription uploaded</p>
                        <button onClick={() => { setPrescriptionFile(null); setPrescriptionPreview(null); }} className="text-red-500 text-xs hover:underline">
                          Remove & re-upload
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <FileText size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-medanta-navy font-semibold mb-1">Click to upload prescription</p>
                        <p className="text-gray-400 text-xs">JPG, PNG, PDF up to 10MB</p>
                        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">No prescription required for your current cart items.</p>
                  <p className="text-gray-400 text-sm mt-1">You can proceed to the next step.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 'payment' && (
            <div>
              <h2 className="font-display font-bold text-xl text-medanta-navy mb-2">Payment Method</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-700 font-medium">
                🔒 Razorpay integration coming soon — select your preferred payment method
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { value: PaymentMethod.cod, label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  { value: PaymentMethod.upi, label: 'UPI Payment', desc: 'Pay via GPay, PhonePe, Paytm, etc.', icon: '📱' },
                  { value: PaymentMethod.card, label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === opt.value ? 'border-medanta-orange bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-medanta-navy text-sm">{opt.label}</p>
                      <p className="text-gray-500 text-xs">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {/* Order Summary */}
              <div className="bg-medanta-grey rounded-xl p-4">
                <h3 className="font-semibold text-medanta-navy text-sm mb-3">Order Summary</h3>
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm py-1">
                    <span className="text-gray-600 truncate flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-medanta-orange">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 'confirmation' && orderId && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">Order Placed!</h2>
              <p className="text-gray-500 mb-4">Your order has been successfully placed.</p>
              <div className="bg-medanta-grey rounded-2xl p-4 mb-6 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono font-semibold text-medanta-navy text-xs">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Delivery Address</span>
                  <span className="font-medium text-medanta-navy text-xs text-right max-w-[60%]">{getDeliveryAddress()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium text-medanta-navy capitalize">{paymentMethod}</span>
                </div>
              </div>
              <div className="bg-medanta-orange/10 border border-medanta-orange/20 rounded-2xl p-4 mb-6">
                <p className="text-medanta-orange font-bold text-lg">⚡ Estimated Delivery: 30–60 Minutes</p>
                <p className="text-gray-600 text-sm mt-1">Our delivery partner is on the way!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/order/$orderId" params={{ orderId }}>
                  <Button className="bg-medanta-navy hover:bg-blue-900 text-white rounded-full px-6">
                    Track Your Order
                  </Button>
                </Link>
                <Link to="/catalog" search={{ search: '', category: '' }}>
                  <Button variant="outline" className="rounded-full px-6 border-medanta-orange text-medanta-orange hover:bg-orange-50">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep !== 'confirmation' && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentStep === 'address') navigate({ to: '/cart' });
                  else if (currentStep === 'prescription') setCurrentStep('address');
                  else if (currentStep === 'payment') setCurrentStep('prescription');
                }}
                className="rounded-full flex items-center gap-2"
              >
                <ArrowLeft size={14} />
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={placeOrder.isPending}
                className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full flex items-center gap-2 px-6"
              >
                {placeOrder.isPending ? (
                  <><Loader2 size={14} className="animate-spin" />Placing Order...</>
                ) : currentStep === 'payment' ? (
                  <>Place Order <CheckCircle size={14} /></>
                ) : (
                  <>Continue <ArrowRight size={14} /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
