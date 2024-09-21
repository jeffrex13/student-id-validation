'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QrScanner';

const ScannerContainer = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScanComplete = (data: string) => {
    setScannedData(data);
    setIsScanning(false);
  };

  const handleScanError = (error: any) => {
    console.error('Scan error:', error);
    setIsScanning(false);
  };

  console.log(scannedData);

  return (
    <Card className="container mx-auto p-4 max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          STUDENT ID VALIDATION
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => setIsScanning(!isScanning)}
          className="w-full mb-4"
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Button>

        <QRScanner
          isScanning={isScanning}
          onScanComplete={handleScanComplete}
          onScanError={handleScanError}
        />
      </CardContent>

      {scannedData && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Scanned Data in Parent:</h2>
          <p>{scannedData}</p>
        </div>
      )}
    </Card>
  );
};

export default ScannerContainer;
