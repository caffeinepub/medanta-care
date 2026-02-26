import React from 'react';
import { CheckCircle, Circle, Package, Truck, Home, ClipboardCheck, ShoppingBag } from 'lucide-react';
import { OrderStatus } from '../backend';

interface OrderProgressTrackerProps {
  currentStatus: OrderStatus;
}

const STAGES = [
  { key: OrderStatus.received, label: 'Order Received', icon: ShoppingBag },
  { key: OrderStatus.verified, label: 'Verified', icon: ClipboardCheck },
  { key: OrderStatus.packed, label: 'Packed', icon: Package },
  { key: OrderStatus.outForDelivery, label: 'Out for Delivery', icon: Truck },
  { key: OrderStatus.delivered, label: 'Delivered', icon: Home },
];

const STATUS_ORDER = [
  OrderStatus.received,
  OrderStatus.verified,
  OrderStatus.packed,
  OrderStatus.outForDelivery,
  OrderStatus.delivered,
];

export default function OrderProgressTracker({ currentStatus }: OrderProgressTrackerProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="w-full">
      {/* Desktop horizontal */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-medanta-orange transition-all duration-500"
            style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
          />
        </div>
        {STAGES.map((stage, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = stage.icon;
          return (
            <div key={stage.key} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-medanta-orange border-medanta-orange text-white'
                    : isCurrent
                    ? 'bg-white border-medanta-orange text-medanta-orange shadow-orange'
                    : 'bg-white border-gray-200 text-gray-300'
                }`}
              >
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={18} />}
              </div>
              <p className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                isCurrent ? 'text-medanta-orange' : isCompleted ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile vertical */}
      <div className="sm:hidden space-y-3">
        {STAGES.map((stage, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = stage.icon;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                  isCompleted
                    ? 'bg-medanta-orange border-medanta-orange text-white'
                    : isCurrent
                    ? 'bg-white border-medanta-orange text-medanta-orange'
                    : 'bg-white border-gray-200 text-gray-300'
                }`}
              >
                {isCompleted ? <CheckCircle size={16} /> : <Icon size={16} />}
              </div>
              <span className={`text-sm font-medium ${
                isCurrent ? 'text-medanta-orange' : isCompleted ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {stage.label}
              </span>
              {isCurrent && (
                <span className="ml-auto text-xs bg-orange-100 text-medanta-orange px-2 py-0.5 rounded-full font-semibold">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
