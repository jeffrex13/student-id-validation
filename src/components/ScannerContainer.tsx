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

  const toggleScanning = () => setIsScanning(prev => !prev);

  return (
    <Card className="container mx-auto p-4 max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          STUDENT ID VALIDATION
        </CardTitle>
      </CardHeader>
      <CardContent className={'flex flex-col items-center gap-4'}>
        <Button
          onClick={toggleScanning}
          className="w-full"
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>

        <div className={isScanning ? 'block' : 'hidden'}>
          <QRScanner
            isScanning={isScanning}
            onScanComplete={handleScanComplete}
            onScanError={handleScanError}
          />
        </div>
        
      </CardContent>

      {scannedData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Scanned Data in Parent:</h2>
          <p>{scannedData}</p>
        </div>
      )}
    </Card>
  );
}