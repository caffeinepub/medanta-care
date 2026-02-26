import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

interface StaticPageProps {
  title: string;
}

const CONTENT: Record<string, { sections: { heading: string; body: string }[] }> = {
  'About Us': {
    sections: [
      {
        heading: 'Who We Are',
        body: 'MEDANTA CARE is a Varanasi-based rapid delivery e-pharmacy committed to making healthcare accessible, affordable, and fast. We deliver genuine medicines to your doorstep in 30–60 minutes across all major areas of Varanasi.',
      },
      {
        heading: 'Our Mission',
        body: 'Our mission is to ensure that no one in Varanasi has to wait for essential medicines. We combine technology with a deep understanding of local healthcare needs to provide a seamless medicine delivery experience.',
      },
      {
        heading: 'Why Trust Us',
        body: 'We are a licensed pharmacy with registered pharmacists on duty. All medicines are sourced directly from authorized distributors, ensuring 100% authenticity. Your health and safety are our top priorities.',
      },
      {
        heading: 'Contact Us',
        body: 'MEDANTA CARE, Varanasi, Uttar Pradesh\nPhone: +91-9999999999\nWhatsApp ordering available 24/7',
      },
    ],
  },
  'Contact Us': {
    sections: [
      {
        heading: 'Get in Touch',
        body: 'We\'re here to help! Reach out to us through any of the following channels.',
      },
      {
        heading: 'Phone & WhatsApp',
        body: '+91-9999999999\nAvailable 24/7 for urgent medicine needs',
      },
      {
        heading: 'Address',
        body: 'MEDANTA CARE\nVaranasi, Uttar Pradesh - 221001',
      },
      {
        heading: 'Service Areas',
        body: 'Lanka, Sigra, Bhelupur, Cantt, Assi, Mahmoorganj, Godowlia, and all areas of Varanasi.',
      },
    ],
  },
  'Terms & Conditions': {
    sections: [
      {
        heading: 'Acceptance of Terms',
        body: 'By using MEDANTA CARE services, you agree to these terms and conditions. Please read them carefully before placing an order.',
      },
      {
        heading: 'Prescription Medicines',
        body: 'Prescription medicines will only be dispensed upon receipt of a valid prescription from a registered medical practitioner. MEDANTA CARE reserves the right to refuse orders without valid prescriptions.',
      },
      {
        heading: 'Delivery',
        body: 'We aim to deliver within 30–60 minutes. Delivery times may vary based on location, traffic, and availability. We are not liable for delays caused by factors beyond our control.',
      },
      {
        heading: 'Returns & Refunds',
        body: 'Medicines once dispensed cannot be returned due to safety regulations. In case of incorrect or damaged products, please contact us within 24 hours of delivery.',
      },
    ],
  },
  'Privacy Policy': {
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We collect information you provide when creating an account, placing orders, or contacting us. This includes name, phone number, delivery address, and prescription details.',
      },
      {
        heading: 'How We Use Your Information',
        body: 'Your information is used solely to process orders, improve our services, and communicate with you about your orders. We do not sell your personal data to third parties.',
      },
      {
        heading: 'Data Security',
        body: 'We implement industry-standard security measures to protect your personal information. All data is encrypted and stored securely on the Internet Computer blockchain.',
      },
      {
        heading: 'Contact',
        body: 'For privacy-related queries, contact us at +91-9999999999.',
      },
    ],
  },
  'Refund Policy': {
    sections: [
      {
        heading: 'Refund Eligibility',
        body: 'Refunds are applicable in cases of incorrect products delivered, damaged products, or non-delivery. Prescription medicines cannot be returned once dispensed.',
      },
      {
        heading: 'Refund Process',
        body: 'To initiate a refund, contact us within 24 hours of delivery with your order ID and reason. Refunds will be processed within 5–7 business days.',
      },
    ],
  },
  'Shipping Policy': {
    sections: [
      {
        heading: 'Delivery Areas',
        body: 'We currently deliver across all areas of Varanasi including Lanka, Sigra, Bhelupur, Cantt, Assi, Mahmoorganj, and Godowlia.',
      },
      {
        heading: 'Delivery Time',
        body: 'Standard delivery: 30–60 minutes. Emergency orders are prioritized. Delivery times may vary during peak hours or adverse weather conditions.',
      },
      {
        heading: 'Delivery Charges',
        body: 'Delivery charges may apply based on order value and distance. Free delivery on orders above ₹500.',
      },
    ],
  },
};

export default function StaticPage({ title }: StaticPageProps) {
  const content = CONTENT[title];

  return (
    <div className="min-h-screen bg-medanta-grey">
      <div className="bg-medanta-navy py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
          <h1 className="font-display font-bold text-3xl text-white">{title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10">
          {content ? (
            <div className="space-y-8">
              {content.sections.map((section, i) => (
                <div key={i}>
                  <h2 className="font-display font-bold text-xl text-medanta-navy mb-3">{section.heading}</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h2 className="font-display font-bold text-xl text-medanta-navy mb-2">{title}</h2>
              <p className="text-gray-500">This page is coming soon. Please check back later.</p>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Questions? Contact us at{' '}
              <a href="tel:+919999999999" className="text-medanta-orange font-semibold hover:underline">
                +91-9999999999
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
