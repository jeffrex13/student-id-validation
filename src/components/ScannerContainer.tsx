'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRScanner from '@/components/QrScanner';
import { IdCard, LogIn, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomDialog from './CustomDialog';
import { useToast } from '@/hooks/use-toast';
import { getUser } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Student = {
  name: string;
  tup_id: string;
  school_year: string;
};

export default function ScannerContainer() {
  const { toast } = useToast();

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [openValidateDialog, setOpenValidateDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'validate' | 'scan'>('scan');
  const [userDetails, setUserDetails] = useState<any | undefined>(undefined);
  const [pageLoad, setPageLoad] = useState<boolean>(true);
  const [studentList, setStudentList] = useState<Student[]>([]); // Initialize as an empty array
  const router = useRouter();

  const handleScanComplete = useCallback(
    (data: string) => {
      setScannedData(data);
      setIsScanning(false); // Stop scanning after a successful scan
      const student = studentList.find((student) => student.tup_id === data);

      if (student) {
        toast({
          title: 'Success',
          description: 'ID successfully scanned!',
          variant: 'default',
          duration: 3000,
        });
        setMatchedStudent(student);
        setOpenValidateDialog(true);
      } else {
        setMatchedStudent(null);
        toast({
          title: 'Error',
          description: 'Invalid ID. Please try again.',
          variant: 'destructive',
          duration: 3000,
        });
      }
    },
    [studentList, toast],
  );

  const handleScanError = useCallback(
    (error: any) => {
      console.error('Scan error:', error);
      setIsScanning(false); // Ensure scanning is stopped on error
      toast({
        title: 'Error',
        description: `Something went wrong. ${
          error.message || error
        } Please try again.`,
        variant: 'default',
        duration: 3000,
      });
    },
    [toast],
  );

  const toggleScanning = (action: string) => {
    setIsScanning((prev) => !prev);
    setActionType(action as 'validate' | 'scan');
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await getUser();
        setUserDetails(res?.userName);
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoad(false);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/student`,
        );
        setStudentList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="max-h-screen max-w-screen">
      {!pageLoad && !userDetails && (
        <Button
          className="absolute top-4 right-4 flex items-center gap-2"
          onClick={() => router.push('/login')}
        >
          Login <LogIn className="w-5 h-5" />
        </Button>
      )}
      <Card className="container mx-auto p-4 max-w-lg w-[32rem] shadow-xl">
        <CardHeader className="mb-2">
          <CardTitle className="text-2xl font-semibold text-center">
            STUDENT ID VALIDATION
          </CardTitle>
          <CardDescription className="text-center">
            Place QR code directly in front of the scanner to ensure a more
            accurate scan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
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
