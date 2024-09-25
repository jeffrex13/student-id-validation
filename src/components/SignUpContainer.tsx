'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import Image from 'next/image';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import Logo from '../../public/images/logo.png';
import Link from 'next/link';

const SignUpContainer = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <p className="text-2xl font-semibold text-center">
            Create an Account
          </p>
        </CardTitle>
        <CardDescription className="text-center">
          Please sign up to continue
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
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="h-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full p-4 font-bold text-white rounded-lg mt-4"
          >
            Sign Up
          </Button>
          <div className="flex justify-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-rose-600">
                Login
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpContainer;
