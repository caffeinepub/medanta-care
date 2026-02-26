import React from 'react';
import { Link } from '@tanstack/react-router';
import { MedicineCategory } from '../backend';
import { CATEGORY_DISPLAY, ALL_CATEGORIES } from '../lib/categoryUtils';

export default function CategoryGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-medanta-navy mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 text-lg">Browse our wide range of medicines across 20 categories</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ALL_CATEGORIES.map(cat => {
            const info = CATEGORY_DISPLAY[cat];
            return (
              <Link
                key={cat}
                to="/catalog"
                search={{ search: '', category: cat }}
                className="group flex flex-col items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-medanta-orange hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-white cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-medanta-grey flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <span className="text-medanta-navy font-semibold text-xs text-center leading-tight group-hover:text-medanta-orange transition-colors">
                  {info.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
