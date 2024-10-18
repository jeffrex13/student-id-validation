'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import Image from 'next/image';
import UserImage from '../../public/images/test-image.png';

interface DialogProps {
  studentData: {
    name: string;
    tup_id: string;
    school_year: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
  actionType?: 'validate' | 'scan';
}

const CustomDialog = ({
  studentData,
  open,
  setOpen,
  actionType,
}: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Student Details
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 py-4 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-6">
              {/* <Avatar className="w-32 h-32 shadow-md">
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar> */}
              <Image
                src={UserImage}
                alt="student-image"
                className="w-36 h-36"
              />
              <div>
                <p className="font-bold mb-2">{studentData.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">ID:</p>
                    <p>{studentData.tup_id}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">School Year:</p>
                    <p>{studentData.school_year}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            {studentData.tup_id && (
              <QRCodeSVG
                value={studentData.tup_id}
                size={175}
                level="H"
                includeMargin={true}
              />
            )}
          </div>
        </div>
        <DialogFooter>
          {actionType === 'validate' && (
            <div className="flex items-center gap-4">
              <Button variant="outline" className="w-full">
                Edit
              </Button>
              <Button className="w-full">Validate</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
