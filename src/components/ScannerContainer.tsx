// 'use client';

// import React, { useState, useCallback } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import QRScanner from '@/components/QrScanner';

// const ScannerContainer = () => {
//   const [isScanning, setIsScanning] = useState<boolean>(false);
//   const [scannedData, setScannedData] = useState<string | null>(null);

//   const handleScanComplete = useCallback((data: string) => {
//     setScannedData(data);
//     setIsScanning(false);
//   }, []);

//   const handleScanError = useCallback((error: any) => {
//     console.error('Scan error:', error);
//     setIsScanning(false);
//   }, []);

//   const toggleScanning = () => setIsScanning(prev => !prev);

//   return (
//     <div>
//       <Card className="container mx-auto p-4 max-w-md shadow-xl">
//       <CardHeader>
//         <CardTitle className="text-2xl font-semibold">
//           STUDENT ID VALIDATION
//         </CardTitle>
//       </CardHeader>
//       <CardContent className='flex flex-col items-center gap-4'>
//         <Button
//           onClick={toggleScanning}
//           className="w-full"
//         >
//           {isScanning ? 'Stop Scanning' : 'Start Scanning'}
//         </Button>

//         <QRScanner
//           isScanning={isScanning}
//           onScanComplete={handleScanComplete}
//           onScanError={handleScanError}
//         />

//       </CardContent>

//       {scannedData && (
//         <div className="mt-4">
//           <h2 className="text-lg font-semibold">Scanned Data in Parent:</h2>
//           <p>{scannedData}</p>
//         </div>
//       )}
//     </Card>
//     </div>

//   );
// };

// export default ScannerContainer;

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QrScanner';
import { IdCard, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ScannerContainer() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScanComplete = useCallback((data: string) => {
    setScannedData(data);
    setIsScanning(false);
  }, []);

  const handleScanError = useCallback((error: any) => {
    console.error('Scan error:', error);
    setIsScanning(false);
  }, []);

  const toggleScanning = () => setIsScanning((prev) => !prev);

  return (
    <Card className="container mx-auto p-4 max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          STUDENT ID VALIDATION
        </CardTitle>
      </CardHeader>
      <CardContent className={'flex flex-col items-center gap-4'}>
        {!isScanning && (
          <>
            <Button
              onClick={toggleScanning}
              className="w-full font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-300 ease-in-out relative"
            >
              <IdCard className="w-5 h-5 absolute left-4" />
              <span className="w-full text-center">VALIDATE ID</span>
            </Button>
            <Button className="w-full font-semibold py-2.5 px-4 rounded-md shadow-sm transition duration-300 ease-in-out relative">
              <ScanLine className="w-5 h-5 absolute left-4" />
              <span className="w-full text-center">SCAN ID</span>
            </Button>
          </>
        )}

        <div
          className={cn(
            isScanning ? 'flex flex-col items-center gap-4' : 'hidden',
          )}
        >
          <QRScanner
            isScanning={isScanning}
            onScanComplete={handleScanComplete}
            onScanError={handleScanError}
          />
          <Button onClick={toggleScanning}>Stop Scanning</Button>
        </div>
      </CardContent>

      {scannedData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Scanned Data:</h2>
          <p>{scannedData}</p>
        </div>
      )}
    </Card>
  );
}
