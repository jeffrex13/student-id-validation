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
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import Logo from '../../public/images/logo.png';

const LoginContainer = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        <form className="flex flex-col content-center gap-4">
          <div>
            <Input type="text" placeholder="Enter Username" className="h-10" />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              className="h-10"
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
          >
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginContainer;
