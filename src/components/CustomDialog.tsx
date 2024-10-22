'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
// import Image from 'next/image';
// import UserImage from '../../public/images/test-image.png';
import { User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import axios from 'axios';
import { cn } from '@/lib/utils';

interface DialogProps {
  studentData: {
    _id: string;
    name: string;
    tup_id: string;
    school_year: string;
    isValid: boolean;
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
  const [isEdit, setIsEdit] = useState(false);
  const [editStudentData, setEditStudentData] = useState({
    name: '',
    tup_id: '',
    school_year: '',
    isValid: false,
  });

  const handleValidate = async () => {
    console.log('validate');
    try {
      const result = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/student/${studentData._id}`,
        { isValid: true },
      );
      console.log('result', result);
    } catch (error) {
      console.error('Error validating student:', error);
    }
  };

  const handleEdit = () => {
    console.log('edit');
    setIsEdit(!isEdit);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Student Details
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 py-4 items-center justify-between">
          <div className="flex items-center gap-10">
            {/* <Avatar className="w-32 h-32 shadow-md">
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar> */}
            {/* <Image
                src={UserImage}
                alt="student-image"
                className="w-24 h-24"
              /> */}
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-14 h-14 text-gray-600" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold">Student ID:</p>
                <p className="text-sm">{studentData.tup_id}</p>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold">Name:</p>
                {isEdit ? (
                  <Input
                    value={editStudentData.name ?? studentData.name}
                    onChange={(e) =>
                      setEditStudentData({
                        ...studentData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{studentData.name}</p>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold">School Year:</p>
                {isEdit ? (
                  <Input
                    value={
                      editStudentData.school_year ?? studentData.school_year
                    }
                    onChange={(e) =>
                      setEditStudentData({
                        ...studentData,
                        school_year: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{studentData.school_year}</p>
                )}
              </div>
              <div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-semibold">Status:</p>
                  <div>
                    <Badge
                      className={cn(
                        'bg-green-500 hover:bg-green-600 text-white rounded-full',
                        !studentData.isValid && 'bg-red-500 hover:bg-red-600',
                      )}
                    >
                      {studentData.isValid ? 'Validated' : 'Not Validated'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            {studentData.tup_id && (
              <QRCodeSVG value={studentData.tup_id} size={100} level="H" />
            )}
          </div>
        </div>
        <DialogFooter>
          {actionType === 'validate' && (
            <div className="flex items-center gap-4">
              <Button variant="outline" className="w-full" onClick={handleEdit}>
                {isEdit ? 'Save' : 'Edit'}
              </Button>
              <Button className="w-full" onClick={handleValidate}>
                Validate
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
