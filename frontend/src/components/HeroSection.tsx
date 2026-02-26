import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldCheck, Star, Award, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-medanta-navy overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-medanta-orange blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-medanta-purple blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-medanta-orange/20 border border-medanta-orange/30 rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} className="text-medanta-orange" />
              <span className="text-medanta-orange text-sm font-semibold">30–60 Min Express Delivery</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Medicines Delivered to Your Door in{' '}
              <span className="text-medanta-orange">30–60 Minutes</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl mb-8 leading-relaxed">
              Fast. Affordable. Trusted. Serving All of Varanasi.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/catalog" search={{ search: '', category: '' }}>
                <button className="bg-medanta-orange text-white font-bold px-8 py-4 rounded-full text-lg hover:opacity-90 transition-all shadow-orange hover:shadow-xl hover:-translate-y-0.5">
                  Order Now
                </button>
              </Link>
              <Link to="/checkout">
                <button className="border-2 border-medanta-purple text-medanta-purple font-bold px-8 py-4 rounded-full text-lg hover:bg-medanta-purple hover:text-white transition-all bg-white/5">
                  Upload Prescription
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: ShieldCheck, text: '100% Genuine' },
                { icon: Award, text: 'Licensed Pharmacy' },
                { icon: Star, text: 'Best Prices' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Icon size={16} className="text-medanta-orange" />
                  <span className="text-white/90 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/assets/generated/hero-banner.dim_1440x600.png"
                alt="MEDANTA CARE - Fast Medicine Delivery"
                className="w-full h-80 object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Floating stats */}
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 shadow-lg">
                <p className="text-medanta-navy font-bold text-2xl">30–60</p>
                <p className="text-gray-500 text-xs">Min Delivery</p>
              </div>
              <div className="absolute top-4 right-4 bg-medanta-orange rounded-2xl p-3 shadow-lg text-white">
                <p className="font-bold text-xl">4.9★</p>
                <p className="text-xs opacity-90">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
