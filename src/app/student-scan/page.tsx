import ScannerContainer from '@/components/ScannerContainer';
import React from 'react';

const StudentScanPage = () => {
  return (
    <div className="relative">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/logo.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px)', // Adjust blur intensity as needed
          zIndex: -1, // Position behind other content
        }}
      />

      {/* Content remains unaffected */}
      <div className="flex flex-col justify-center items-center container mx-auto max-w-md h-screen z-10">
        <ScannerContainer />
      </div>
    </div>
  );
};

export default StudentScanPage;
