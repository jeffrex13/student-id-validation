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
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

const CustomDialog = ({
  studentData,
  open,
  setOpen,
  actionType,
}: DialogProps) => {
  const { toast } = useToast();

  const [isEdit, setIsEdit] = useState(false);
  const [editStudentData, setEditStudentData] = useState({
    profile_image: '',
    name: '',
    tup_id: '',
    school_year: '',
    isValid: false,
  });
  const [showValidateConfirmation, setShowValidateConfirmation] =
    useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentStudentData, setCurrentStudentData] = useState({
    _id: studentData._id,
    profile_image: studentData.profile_image || '',
    name: studentData.name,
    tup_id: studentData.tup_id,
    school_year: studentData.school_year,
    isValid: studentData.isValid,
  });

  const hasChanges = () => {
    return (
      editStudentData.profile_image !== studentData.profile_image ||
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
      if (studentData) {
        setEditStudentData({
          profile_image: studentData.profile_image || '',
          name: studentData.name,
          school_year: studentData.school_year,
          tup_id: studentData.tup_id,
          isValid: studentData.isValid,
        });
      }
    }
  };

  const confirmEdit = async () => {
    try {
      const result = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/student/${studentData._id}`,
        editStudentData,
      );
      console.log(result);

      if (result) {
        setCurrentStudentData({
          _id: result.data.updatedStudent._id,
          profile_image: result.data.updatedStudent.profile_image,
          name: result.data.updatedStudent.name,
          tup_id: result.data.updatedStudent.tup_id,
          school_year: result.data.updatedStudent.school_year,
          isValid: result.data.updatedStudent.isValid,
        });
        setIsEdit(false);
        setShowEditConfirmation(false);
        toast({
          title: 'Success',
          description: 'Changes saved successfully',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: 'Error',
        description: 'Error saving changes',
        variant: 'destructive',
      });
    }
    // setIsEdit(false);
    // setShowEditConfirmation(false);
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        // Compression options
        const options = {
          maxSizeMB: 0.05, // 50KB = 0.05MB
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        // Compress the image
        const compressedFile = await imageCompression(file, options);

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setSelectedImage(base64String);
        };

        reader.onerror = () => {
          toast({
            title: 'Error',
            description: 'Error reading file',
            variant: 'destructive',
          });
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        toast({
          title: 'Error',
          description: 'Error processing image',
          variant: 'destructive',
        });
      }
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Student Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex justify-between">
              <div className="flex flex-col justify-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center">
                    {selectedImage ? (
                      <Image
                        src={selectedImage}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="rounded-lg"
                        priority
                      />
                    ) : currentStudentData.profile_image ? (
                      <Image
                        src={currentStudentData.profile_image}
                        alt="Student"
                        width={200}
                        height={200}
                        className="rounded-lg"
                        priority
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
                        <User className="h-16 w-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                {isEdit && (
                  <div className="mt-2 space-y-2">
                    <Input
                      type="file"
                      id="imagefile"
                      name="imagefile"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-60"
                    />
                    <p className="text-xs font-medium text-gray-600">
                      Note: Max image size should not exceed 1 mb.
                    </p>
                  </div>
                )}

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
              <div className="mt-2">
                {currentStudentData.tup_id && (
                  <QRCodeSVG
                    value={currentStudentData.tup_id}
                    size={90}
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
