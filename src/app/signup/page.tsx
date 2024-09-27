import SignUpContainer from '@/components/SignUpContainer';
import { redirect } from 'next/navigation';
import React from 'react';
import { getUser } from '../actions/auth';

const page = async () => {
  const data = await getUser();

  if (data) {
    redirect('/');
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <SignUpContainer />
    </div>
  );
};

export default page;
