'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QrScanner';
import { IdCard, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomDialog from './CustomDialog';

const studentList = [
  {
    name: 'User A',
    tup_id: 'TUPM-21-7974',
    school_year: '2021',
  },
  {
    name: 'User B',
    tup_id: 'TUPM-21-1342',
    school_year: '2021',
  },
  {
    name: 'User C',
    tup_id: 'TUPM-21-2891',
    school_year: '2021',
  },
];

export default function ScannerContainer() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [matchedStudent, setMatchedStudent] = useState<{
    name: string;
    tup_id: string;
    school_year: string;
  } | null>(null);
  const [openValidateDialog, setOpenValidateDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'validate' | 'scan'>('scan');

  const handleScanComplete = useCallback((data: string) => {
    setScannedData(data);
    setIsScanning(false);

    const student = studentList.find((student) => student.tup_id === data);
    if (student) {
      setMatchedStudent(student);
      setOpenValidateDialog(true);
    } else {
      setMatchedStudent(null);
    }
  }, []);

  const handleScanError = useCallback((error: any) => {
    console.error('Scan error:', error);
    setIsScanning(false);
  }, []);

  console.log('matchedStudent:', matchedStudent);

  const toggleScanning = (action: string) => {
    setIsScanning((prev) => !prev);
    setActionType(action as 'validate' | 'scan');
  };

  return (
    <div>
      <Card className="container mx-auto p-4 max-w-lg w-[32rem] shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            STUDENT ID VALIDATION
          </CardTitle>
        </CardHeader>
        <CardContent className={'flex flex-col items-center gap-4'}>
          {!isScanning && (
            <>
              <Button
                onClick={() => toggleScanning('validate')}
                className="w-full font-semibold py-6 px-4 rounded-md shadow-sm transition duration-300 ease-in-out relative"
              >
                <IdCard className="w-5 h-5 absolute left-4" />
                <span className="w-full text-center text-lg">VALIDATE ID</span>
              </Button>
              <Button
                onClick={() => toggleScanning('scan')}
                className="w-full font-semibold py-6 px-4 rounded-md shadow-sm transition duration-300 ease-in-out relative"
              >
                <ScanLine className="w-5 h-5 absolute left-4" />
                <span className="w-full text-center text-lg">SCAN ID</span>
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
            <Button onClick={() => setIsScanning(false)}>Stop Scanning</Button>
          </div>
        </CardContent>
      </Card>
      {scannedData && matchedStudent !== null && (
        <CustomDialog
          actionType={actionType}
          open={openValidateDialog}
          setOpen={setOpenValidateDialog}
          studentData={matchedStudent}
        />
      )}
    </div>
  );
}
