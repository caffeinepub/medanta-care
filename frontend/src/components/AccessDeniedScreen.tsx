import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <ShieldX size={40} className="text-red-500" />
      </div>
      <h1 className="font-display font-bold text-3xl text-medanta-navy mb-3">Access Denied</h1>
      <p className="text-gray-600 max-w-md mb-8">
        You don't have permission to access this page. Admin role is required to view the admin dashboard.
      </p>
      <Link to="/">
        <Button className="bg-medanta-orange hover:bg-orange-600 text-white rounded-full px-8">
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
