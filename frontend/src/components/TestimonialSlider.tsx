import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Lanka, Varanasi',
    rating: 5,
    text: 'Absolutely amazing service! I ordered medicines at 11 PM and they were delivered within 45 minutes. The medicines were genuine and properly packed. MEDANTA CARE is a lifesaver!',
    avatar: 'PS',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Sigra, Varanasi',
    rating: 5,
    text: 'Best online pharmacy in Varanasi! Prices are much better than local medical stores. The prescription upload feature is very convenient. Highly recommended!',
    avatar: 'RK',
  },
  {
    name: 'Anita Singh',
    location: 'Bhelupur, Varanasi',
    rating: 5,
    text: 'I was skeptical at first but MEDANTA CARE exceeded my expectations. Genuine medicines, fast delivery, and excellent customer support. Will definitely order again!',
    avatar: 'AS',
  },
  {
    name: 'Dr. Vikram Mishra',
    location: 'Cantt, Varanasi',
    rating: 5,
    text: 'As a doctor, I recommend MEDANTA CARE to my patients. They maintain proper cold chain for sensitive medicines and their pharmacist verification is thorough.',
    avatar: 'VM',
  },
  {
    name: 'Sunita Gupta',
    location: 'Assi, Varanasi',
    rating: 5,
    text: 'My elderly parents needed urgent medicines late at night. MEDANTA CARE delivered in 35 minutes! The COD option is very convenient for senior citizens.',
    avatar: 'SG',
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

  return (
    <section className="section-padding bg-medanta-grey">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-medanta-navy mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-lg">Trusted by thousands across Varanasi</p>
        </div>

        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-card">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={20} className="text-medanta-yellow fill-medanta-yellow" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-gray-700 text-lg sm:text-xl text-center leading-relaxed mb-8 italic">
            "{t.text}"
          </blockquote>

          {/* Author */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-medanta-navy text-white font-bold flex items-center justify-center text-lg">
              {t.avatar}
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-medanta-navy">{t.name}</p>
              <p className="text-gray-400 text-sm">{t.location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-medanta-orange hover:text-medanta-orange transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-medanta-orange w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-medanta-orange hover:text-medanta-orange transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
