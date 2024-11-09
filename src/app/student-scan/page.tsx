import ScannerContainer from '@/components/ScannerContainer';
import React from 'react';
import { getUser } from '../actions/auth';
import { redirect } from 'next/navigation';

const StudentScanPage = async () => {
  const data = await getUser();

  if (data) {
    redirect('/');
  }

  return (
    <div className="relative h-screen z-10">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center w-screen"
        style={{
          backgroundColor: '#E5E7EB',
          backgroundImage: "url('/images/logo.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)', // Adjust blur intensity as needed
          zIndex: -1, // Position behind other content
        }}
      />

      {/* Content remains unaffected */}
      <div className="flex flex-col justify-center items-center container mx-auto max-w-md h-screen">
        <ScannerContainer />
      </div>
    </div>
  );
};

export default StudentScanPage;
