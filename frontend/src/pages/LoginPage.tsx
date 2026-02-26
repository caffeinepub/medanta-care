import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldCheck, Zap, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, isLoggingIn, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle size={48} className="text-green-500 mb-4" />
        <h2 className="font-display font-bold text-2xl text-medanta-navy mb-2">You're already logged in!</h2>
        <Link to="/">
          <Button className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8 mt-4">
            Go to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medanta-grey flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-medanta-navy mb-4">
              <span className="text-white font-display font-black text-xl">M</span>
            </div>
            <h1 className="font-display font-black text-2xl text-medanta-navy">
              Welcome to <span className="text-medanta-orange">MEDANTA</span> CARE
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Login to order medicines, track orders, and manage your health
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Zap, text: '30–60 min delivery to your door', color: 'text-medanta-orange' },
              { icon: ShieldCheck, text: '100% genuine medicines guaranteed', color: 'text-green-600' },
              { icon: Award, text: 'Licensed pharmacy, verified pharmacists', color: 'text-medanta-purple' },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-center gap-3 bg-medanta-grey rounded-xl px-4 py-3">
                <Icon size={18} className={color} />
                <span className="text-gray-700 text-sm">{text}</span>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-medanta-navy hover:bg-blue-900 text-white rounded-full py-4 font-bold text-base flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              'Login with Internet Identity'
            )}
          </Button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secure, decentralized authentication. No password needed.
          </p>

          <div className="mt-6 text-center">
            <Link to="/" className="text-medanta-orange text-sm hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
