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
import { User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { DialogProps } from '@/types';

const CustomDialog = ({
  studentData,
  open,
  setOpen,
  actionType,
}: DialogProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editStudentData, setEditStudentData] = useState({
    _id: '',
    name: '',
    tup_id: '',
    school_year: '',
    isValid: false,
  });
  const [showValidateConfirmation, setShowValidateConfirmation] =
    useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [currentStudentData, setCurrentStudentData] = useState({
    _id: studentData._id,
    name: studentData.name,
    tup_id: studentData.tup_id,
    school_year: studentData.school_year,
    isValid: studentData.isValid,
  });

  const hasChanges = () => {
    return (
      editStudentData.name !== studentData.name ||
      editStudentData.school_year !== studentData.school_year
    );
  };

  const handleValidate = async () => {
    try {
      const result = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/student/${studentData._id}`,
        { isValid: true },
      );
      setCurrentStudentData({
        ...currentStudentData,
        isValid: result.data.updatedStudent.isValid,
      });
      setShowValidateConfirmation(false);
    } catch (error) {
      console.error('Error validating student:', error);
    }
  };

  const handleEdit = () => {
    if (isEdit) {
      if (hasChanges()) {
        setShowEditConfirmation(true);
      } else {
        setIsEdit(false);
      }
    } else {
      setIsEdit(true);
      setEditStudentData({
        _id: studentData._id,
        name: studentData.name,
        school_year: studentData.school_year,
        tup_id: studentData.tup_id,
        isValid: studentData.isValid,
      });
    }
  };

  const confirmEdit = async () => {
    const result = await axios.patch(
      `${process.env.NEXT_PUBLIC_API}/student/${studentData._id}`,
      editStudentData,
    );
    console.log(result);
    setCurrentStudentData({
      _id: result.data.updatedStudent._id,
      name: result.data.updatedStudent.name,
      tup_id: result.data.updatedStudent.tup_id,
      school_year: result.data.updatedStudent.school_year,
      isValid: result.data.updatedStudent.isValid,
    });
    setIsEdit(false);
    setShowEditConfirmation(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Student Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col justify-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
                <div>
                  <h2 className="font-semibold">{currentStudentData.name}</h2>
                  <Badge
                    className={cn(
                      'bg-green-500 hover:bg-green-600 text-white rounded-full',
                      !currentStudentData.isValid &&
                        'bg-red-500 hover:bg-red-600',
                    )}
                  >
                    {currentStudentData.isValid ? 'Validated' : 'Not Validated'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-center items-center">
                {currentStudentData.tup_id && (
                  <QRCodeSVG
                    value={currentStudentData.tup_id}
                    size={80}
                    level="H"
                  />
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">Student ID:</p>
                <p className="col-span-2 text-sm">
                  {currentStudentData.tup_id}
                </p>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">Name:</p>
                {isEdit ? (
                  <Input
                    className="col-span-2"
                    value={editStudentData.name || currentStudentData.name}
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="col-span-2 text-sm">
                    {currentStudentData.name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="text-sm font-medium">School Year:</p>
                {isEdit ? (
                  <Input
                    className="col-span-2"
                    value={
                      editStudentData.school_year ||
                      currentStudentData.school_year
                    }
                    onChange={(e) =>
                      setEditStudentData({
                        ...editStudentData,
                        school_year: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="col-span-2 text-sm">
                    {currentStudentData.school_year}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {actionType === 'validate' && (
              <div className="flex items-center gap-4 w-full">
                {isEdit ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEdit(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setShowValidateConfirmation(true)}
                  >
                    Validate
                  </Button>
                )}
                <Button
                  variant={isEdit ? 'destructive' : 'outline'}
                  className="w-full"
                  onClick={handleEdit}
                  disabled={isEdit && !hasChanges()}
                >
                  {isEdit ? 'Save' : 'Edit'}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validation Confirmation Dialog */}
      <Dialog
        open={showValidateConfirmation}
        onOpenChange={setShowValidateConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Validation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to validate this student?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowValidateConfirmation(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleValidate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Confirmation Dialog */}
      <Dialog
        open={showEditConfirmation}
        onOpenChange={setShowEditConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to save the changes?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditConfirmation(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomDialog;
