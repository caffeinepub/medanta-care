import React from 'react';
import { Link } from '@tanstack/react-router';
import { SiInstagram, SiFacebook, SiWhatsapp } from 'react-icons/si';
import { MapPin, Phone, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'medanta-care');

  return (
    <footer className="bg-medanta-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-display font-bold text-2xl">
                <span className="text-medanta-orange">MEDANTA</span> CARE
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Medicines Delivered in 30–60 Minutes Across Varanasi. Fast. Affordable. Trusted.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-medanta-orange transition-colors"
              >
                <SiInstagram size={16} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-medanta-orange transition-colors"
              >
                <SiFacebook size={16} />
              </a>
              <a
                href="https://wa.me/919999999999?text=Hi%20MEDANTA%20CARE%2C%20I%20want%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-500 transition-colors"
              >
                <SiWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4 text-medanta-orange">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Shop Medicines', to: '/catalog' },
                { label: 'Upload Prescription', to: '/checkout' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Blog', to: '/blog' },
                { label: 'Track Order', to: '/dashboard' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-medanta-orange text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4 text-medanta-orange">Legal</h3>
            <ul className="space-y-2">
              {[
                { label: 'Terms & Conditions', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Refund Policy', to: '/refund' },
                { label: 'Shipping Policy', to: '/shipping' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-medanta-orange text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-base mb-4 text-medanta-orange">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-medanta-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">MEDANTA CARE</p>
                  <p className="text-white/70 text-sm">Varanasi, Uttar Pradesh</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-medanta-orange flex-shrink-0" />
                <div>
                  <a href="tel:+918429145707" className="text-white/70 text-sm hover:text-medanta-orange transition-colors">
                    +91-8429145707
                  </a>
                  <p className="text-white/50 text-xs">WhatsApp Ordering Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs">
            © {year} MEDANTA CARE. All rights reserved.
          </p>
          <p className="text-white/50 text-xs flex items-center gap-1">
            Built with <Heart size={12} className="text-medanta-orange fill-medanta-orange" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-medanta-orange hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
