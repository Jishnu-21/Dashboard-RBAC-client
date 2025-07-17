'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import DashboardCards from './components/DashboardCards';
import { toast } from 'sonner';

function getRole(token: string | null): string {
  if (!token) return '';
  try {
    const decoded: any = jwtDecode(token);
    return decoded.role;
  } catch {
    return '';
  }
}

function getTokenExpiration(token: string | null): number | null {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return null;
    return decoded.exp * 1000;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  const exp = getTokenExpiration(token);
  if (!exp) return true;
  return Date.now() >= exp;
}

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }
    if (isTokenExpired(token)) {
      toast.error('Session expired. Please log in again.');
      localStorage.removeItem('token');
      router.replace('/login');
      return;
    }
    const userRole = getRole(token);
    setRole(userRole);
    if (!userRole) router.replace('/login');

    // Set up auto-logout timer
    const exp = getTokenExpiration(token);
    if (exp) {
      const msUntilExpiry = exp - Date.now();
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(() => {
        toast.error('Session expired. You have been logged out.');
        localStorage.removeItem('token');
        router.replace('/login');
      }, msUntilExpiry);
    }
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col items-center p-6 sm:p-8">
      <div className="w-full flex justify-between items-center mb-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FFFFFF]">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-[#FFFFFF] cursor-pointer text-[#000000] px-4 py-2 rounded-md font-medium hover:bg-[#000000] hover:text-[#FFFFFF] hover:border-[#FFFFFF] border border-[#FFFFFF] transition-all"
        >
          Logout
        </button>
      </div>
      <DashboardCards role={role} />
    </div>
  );
}