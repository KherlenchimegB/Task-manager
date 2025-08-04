'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/services/api';

export default function ResetPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all authentication data
    auth.clearAuth();
    
    // Redirect to login
    router.push('/auth/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Clearing authentication...</p>
      </div>
    </div>
  );
} 