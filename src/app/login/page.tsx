'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGithub, FaLinkedin, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/'); // Redirect to dashboard/homepage if already logged in
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('https://dashboard-rbac-server.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      router.push('/');
    } catch (err: any) {
   
      toast.error(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "appearance-none relative block w-full px-3 py-2 border border-[#333333] bg-[#1C1C1C] text-[#FFFFFF] placeholder-[#888888] focus:outline-none focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] transition-colors sm:text-sm";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#FFFFFF]">
           Dashboard Application
          </h2>
          <p className="mt-2 text-center text-sm text-[#888888]">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#888888] mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`${inputClasses} rounded-md`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#888888] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`${inputClasses} rounded-md pr-10`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-2 flex items-center text-[#888888] hover:text-[#FFFFFF] focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group cursor-pointer relative w-full flex justify-center py-2.5 px-4 border border-[#FFFFFF] text-sm font-medium rounded-md text-[#000000] bg-[#FFFFFF] hover:bg-[#000000] hover:text-[#FFFFFF] hover:border-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFFFF] disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Loading...' : 'Sign in'}
            </button>
          </div>
        </form>
        {error && (
          <div className="text-red-500 text-center mt-2">{error}</div>
        )}
        <div className="flex justify-center gap-6 mt-6">
          <a href="https://github.com/Jishnu-21" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-2xl text-white hover:text-[#888888] transition-colors" />
          </a>
          <a href="https://www.linkedin.com/in/jishnu-jp-b7b750259/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="text-2xl text-white hover:text-[#888888] transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}