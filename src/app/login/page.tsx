import LoginContainer from '@/components/LoginContainer';
import React from 'react';
import { getUser } from '../actions/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const data = await getUser();

  if (data) {
    redirect('/');
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <LoginContainer />
    </div>
  );
};

export default page;
