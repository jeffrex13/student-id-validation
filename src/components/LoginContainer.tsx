'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import Logo from '../../public/images/logo.png';
import Link from 'next/link';
import { login } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/app/contexts/authContext';

const LoginContainer = () => {
  // const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  // const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await login({ username, password });
      setIsLoading(false);

      if (!result.success) {
        setError(result.message);
      } else {
        router.push('/');
      }
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Card className="w-[23rem] pb-2 shadow-xl">
      <CardHeader>
        <Image
          className="mx-auto"
          src={Logo}
          alt="Logo"
          width={145}
          height={145}
        />
        <CardTitle>
          <p className="text-2xl font-semibold text-center">Welcome!</p>
        </CardTitle>
        <CardDescription className="text-center">
          Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col content-center gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <Input
              type="text"
              placeholder="Enter Username"
              className="h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full p-4 font-bold text-white rounded-lg mt-4"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
          </Button>
          {error && <p className="text-sm text-red-600 mx-auto">{error}</p>}
          <div className="flex justify-center">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-rose-600">
                Create account
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginContainer;
