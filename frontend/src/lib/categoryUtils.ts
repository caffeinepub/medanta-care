import { MedicineCategory } from '../backend';

export const CATEGORY_DISPLAY: Record<MedicineCategory, { label: string; icon: string; color: string }> = {
  [MedicineCategory.antiCancer]: { label: 'Anti Cancer', icon: '🎗️', color: 'bg-red-50 border-red-200 text-red-700' },
  [MedicineCategory.antiFungal]: { label: 'Anti Fungal', icon: '🍄', color: 'bg-green-50 border-green-200 text-green-700' },
  [MedicineCategory.antiViral]: { label: 'Anti Viral', icon: '🦠', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  [MedicineCategory.arthritis]: { label: 'Arthritis', icon: '🦴', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  [MedicineCategory.bloodDisorders]: { label: 'Blood Disorders', icon: '🩸', color: 'bg-red-50 border-red-200 text-red-800' },
  [MedicineCategory.general]: { label: 'General', icon: '💊', color: 'bg-gray-50 border-gray-200 text-gray-700' },
  [MedicineCategory.heartDisease]: { label: 'Heart Disease', icon: '❤️', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  [MedicineCategory.hepatitis]: { label: 'Hepatitis', icon: '🫀', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  [MedicineCategory.hivAids]: { label: 'HIV/AIDS', icon: '🔴', color: 'bg-red-50 border-red-200 text-red-700' },
  [MedicineCategory.infertility]: { label: 'Infertility', icon: '👶', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  [MedicineCategory.nephrology]: { label: 'Nephrology', icon: '🫘', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  [MedicineCategory.osteoporosis]: { label: 'Osteoporosis', icon: '🦷', color: 'bg-slate-50 border-slate-200 text-slate-700' },
  [MedicineCategory.skinDisease]: { label: 'Skin Disease', icon: '🧴', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  [MedicineCategory.transplant]: { label: 'Transplant', icon: '🏥', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  [MedicineCategory.vaccine]: { label: 'Vaccine', icon: '💉', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
  [MedicineCategory.weightLoss]: { label: 'Weight Loss', icon: '⚖️', color: 'bg-lime-50 border-lime-200 text-lime-700' },
  [MedicineCategory.diabetesCare]: { label: 'Diabetes Care', icon: '🩺', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  [MedicineCategory.cardiacCare]: { label: 'Cardiac Care', icon: '💓', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  [MedicineCategory.otcProducts]: { label: 'OTC Products', icon: '🛒', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  [MedicineCategory.surgicalDevices]: { label: 'Surgical & Medical Devices', icon: '🔬', color: 'bg-violet-50 border-violet-200 text-violet-700' },
};

export const ALL_CATEGORIES = Object.values(MedicineCategory);

export function getCategoryLabel(category: MedicineCategory): string {
  return CATEGORY_DISPLAY[category]?.label ?? category;
}

export function getCategoryIcon(category: MedicineCategory): string {
  return CATEGORY_DISPLAY[category]?.icon ?? '💊';
}

export function getCategoryColor(category: MedicineCategory): string {
  return CATEGORY_DISPLAY[category]?.color ?? 'bg-gray-50 border-gray-200 text-gray-700';
}

export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    received: 'Order Received',
    verified: 'Verified',
    packed: 'Packed',
    outForDelivery: 'Out for Delivery',
    delivered: 'Delivered',
  };
  return map[status] ?? status;
}
