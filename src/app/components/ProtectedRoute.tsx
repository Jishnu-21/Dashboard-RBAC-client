import { useEffect, useState, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

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

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [router]);

  if (loading) return null;
  return <>{children}</>;
} 