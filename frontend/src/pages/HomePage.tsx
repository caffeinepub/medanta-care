import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import TestimonialSlider from '../components/TestimonialSlider';
import { Link } from '@tanstack/react-router';
import {
  Zap, DollarSign, FileText, ShieldCheck,
  Search, CheckCircle, Truck,
  MapPin, UserCheck, CreditCard, Eye, Award
} from 'lucide-react';

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Why Choose MEDANTA CARE */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-medanta-navy mb-3">
              Why Choose MEDANTA CARE?
            </h2>
            <p className="text-gray-500 text-lg">Your health, our priority — every single time</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '/assets/generated/icon-delivery.dim_80x80.png',
                title: '30–60 Min Express Delivery',
                desc: 'Get your medicines delivered at your doorstep within 30–60 minutes anywhere in Varanasi.',
                color: 'bg-orange-50',
              },
              {
                icon: '/assets/generated/icon-pricing.dim_80x80.png',
                title: 'Competitive Pricing',
                desc: 'Best prices in Varanasi with transparent billing. No hidden charges, ever.',
                color: 'bg-green-50',
              },
              {
                icon: '/assets/generated/icon-prescription.dim_80x80.png',
                title: 'Easy Prescription Upload',
                desc: 'Simply upload your prescription photo during checkout. Our pharmacist verifies it instantly.',
                color: 'bg-purple-50',
              },
              {
                icon: '/assets/generated/icon-authentic.dim_80x80.png',
                title: '100% Authentic Medicines',
                desc: 'All medicines sourced directly from licensed distributors. Guaranteed genuine products.',
                color: 'bg-blue-50',
              },
            ].map((item, i) => (
              <div key={i} className={`${item.color} rounded-2xl p-6 text-center card-hover`}>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-16 h-16 object-contain"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="font-display font-bold text-medanta-navy text-base mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <CategoryGrid />

      {/* 4. Price Advantage */}
      <section className="section-padding bg-medanta-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                Better Prices Than Local Pharmacies
              </h2>
              <p className="text-white/70 text-lg mb-8">
                We work directly with licensed distributors to bring you the most competitive prices in Varanasi.
              </p>
              <div className="space-y-4">
                {[
                  { icon: '✅', title: 'No Hidden Charges', desc: 'What you see is what you pay. Transparent pricing always.' },
                  { icon: '📦', title: 'Bulk Purchase Discounts', desc: 'Save more when you order in bulk for chronic medications.' },
                  { icon: '🔄', title: 'Monthly Subscription Plans', desc: 'Subscribe for regular medicines and save up to 15% every month.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/10 rounded-2xl p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 text-white">
              <h3 className="font-display font-bold text-xl mb-6 text-medanta-orange">Price Comparison</h3>
              <div className="space-y-4">
                {[
                  { medicine: 'Metformin 500mg (30 tabs)', local: '₹85', medanta: '₹68', save: '20%' },
                  { medicine: 'Atorvastatin 10mg (30 tabs)', local: '₹120', medanta: '₹95', save: '21%' },
                  { medicine: 'Amlodipine 5mg (30 tabs)', local: '₹75', medanta: '₹58', save: '23%' },
                  { medicine: 'Pantoprazole 40mg (30 tabs)', local: '₹95', medanta: '₹72', save: '24%' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/80 text-sm flex-1">{row.medicine}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/40 line-through">{row.local}</span>
                      <span className="text-medanta-orange font-bold">{row.medanta}</span>
                      <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                        Save {row.save}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/catalog" search={{ search: '', category: '' }}>
                <button className="mt-6 w-full bg-medanta-orange text-white font-bold py-3 rounded-full hover:opacity-90 transition-all">
                  Shop Now & Save
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-medanta-navy mb-3">
              How It Works
            </h2>
            <p className="text-gray-500 text-lg">Order your medicines in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-medanta-orange to-medanta-purple z-0" />
            {[
              {
                step: '01',
                icon: '/assets/generated/icon-step1.dim_100x100.png',
                title: 'Search or Upload Prescription',
                desc: 'Browse our catalog or simply upload your prescription photo. We handle the rest.',
                bg: 'bg-medanta-navy',
              },
              {
                step: '02',
                icon: '/assets/generated/icon-step2.dim_100x100.png',
                title: 'We Verify & Confirm',
                desc: 'Our licensed pharmacist verifies your prescription and confirms your order within minutes.',
                bg: 'bg-medanta-orange',
              },
              {
                step: '03',
                icon: '/assets/generated/icon-step3.dim_100x100.png',
                title: 'Delivered in 30–60 Minutes',
                desc: 'Your medicines are packed and dispatched immediately for express delivery to your door.',
                bg: 'bg-medanta-purple',
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center z-10">
                <div className={`w-24 h-24 rounded-full ${item.bg} flex items-center justify-center mb-6 shadow-lg relative`}>
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-14 h-14 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center text-xs font-bold text-medanta-navy shadow">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-medanta-navy text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Service Areas */}
      <section className="section-padding bg-medanta-grey">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-medanta-navy mb-3">
            Serving All Areas of Varanasi
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            We deliver to every corner of the holy city — fast and reliably
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Lanka', 'Sigra', 'Bhelupur', 'Cantt', 'Assi', 'Mahmoorganj', 'Godowlia', 'Sarnath', 'Varanasi City'].map(area => (
              <div key={area} className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-xs border border-gray-100 hover:border-medanta-orange hover:shadow-card transition-all">
                <MapPin size={14} className="text-medanta-orange" />
                <span className="text-medanta-navy font-semibold text-sm">{area}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 inline-flex items-center gap-2 bg-medanta-orange/10 border border-medanta-orange/20 rounded-full px-6 py-3">
            <Zap size={16} className="text-medanta-orange" />
            <span className="text-medanta-orange font-semibold">30–60 minute delivery to all these areas</span>
          </div>
        </div>
      </section>

      {/* 7. Trust & Compliance */}
      <section className="section-padding bg-navy-gradient">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
            Your Trust is Our Foundation
          </h2>
          <p className="text-white/70 text-lg mb-12">
            We operate with the highest standards of pharmacy practice
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { imgSrc: '/assets/generated/badge-licensed.dim_120x120.png', FallbackIcon: Award, title: 'Licensed Pharmacy', desc: 'Govt. registered & licensed' },
              { imgSrc: null, FallbackIcon: UserCheck, title: 'Verified Pharmacist', desc: 'Registered pharmacist on duty' },
              { imgSrc: null, FallbackIcon: CreditCard, title: 'Secure Payments', desc: 'SSL encrypted transactions' },
              { imgSrc: null, FallbackIcon: Eye, title: 'Data Privacy', desc: 'Your data is safe with us' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {item.imgSrc ? (
                    <img
                      src={item.imgSrc}
                      alt={item.title}
                      className="w-16 h-16 object-contain"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-medanta-orange/20 flex items-center justify-center">
                      <item.FallbackIcon size={28} className="text-medanta-orange" />
                    </div>
                  )}
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-white/60 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <TestimonialSlider />
    </main>
  );
}
