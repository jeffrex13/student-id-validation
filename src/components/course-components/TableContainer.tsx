'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import CustomDataTable from '../CustomTable';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  File,
  FolderOutput,
  Plus,
  Search,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import Image from 'next/image';
// import Image from 'next/image';

interface TableContainerProps {
  course: string;
}

export default function TableContainer({ course }: TableContainerProps) {
  const { toast } = useToast();
  const [studentList, setStudentList] = useState<any>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSingleAdd, setShowSingleAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editFormData, setEditFormData] = useState<Student>({
    _id: '',
    name: '',
    tup_id: '',
    school_year: '',
    isValid: false,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [imageFile, setImageFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // You can process the files or send them to your server here
    acceptedFiles.forEach((file) => {
      const fileType = file.type;
      if (
        fileType === 'text/csv' ||
        fileType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        processFile(file);
      } else {
        alert('Please upload a valid CSV or XLSX file.');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFile = async (file: File) => {
    // Specify the type of file
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        // Check if e.target.result is not null
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        // Process the workbook as needed
        console.log(workbook);

        const formData = new FormData();
        formData.append('file', file); // Append the file to the FormData
        formData.append('course', course); // Append the file type to the FormData

        try {
          // Make the API call to upload the file
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/student/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          refreshData();
          toast({
            title: 'Success',
            description: 'File uploaded successfully!',
            variant: 'default',
            duration: 3000,
          });
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Error',
            description: 'Error uploading file. Please try again.',
            variant: 'destructive',
            duration: 3000,
          });
        }
      } else {
        console.error('File reading failed: result is null');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: true,
  });

  const refreshData = () => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/student/${course}`,
        );
        setStudentList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  };

  const handleSingleAdd = () => {
    setShowSingleAdd(true);
    // Implement single add logic here
  };

  const handleMultipleAdd = () => {
    setShowFileUpload(true);
    // Implement multiple add logic here
  };

  const handleView = (student: Student) => {
    setStudentDetails(student);
    setShowView(true);
  };

  const handleEdit = (student: Student) => {
    setStudentDetails(student);
    setShowEdit(true);
  };

  const handleDelete = (student: Student) => {
    console.log('Delete selected for student:', student);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size should be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      // Proceed with file processing
      // setImageFile(file);
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

      reader.readAsDataURL(file);
    }
  };

  // Edit Submit
  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/student/${editFormData._id}`,
        {
          profile_image: selectedImage,
          name: editFormData.name,
          tup_id: editFormData.tup_id,
          school_year: editFormData.school_year,
          isValid: editFormData.isValid,
        },
      );

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Student information updated successfully!',
          variant: 'default',
          duration: 3000,
        });
        setShowEdit(false);
        refreshData(); // Refresh the table data
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: 'Failed to update student information.',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
    setShowSingleAdd(false); // or setShowEdit(false)
  };

  const handleCloseEditDialog = () => {
    setSelectedImage(null);
    setShowEdit(false);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/student/${course}`,
        );
        setStudentList(response.data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Error fetching students. Please try again.',
          variant: 'destructive',
          duration: 3000,
        });
      }
    };

    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  useEffect(() => {
    if (studentDetails) {
      setEditFormData({
        _id: studentDetails._id,
        name: studentDetails.name,
        tup_id: studentDetails.tup_id,
        school_year: studentDetails.school_year,
        isValid: studentDetails.isValid,
      });
    }
  }, [studentDetails]);

  console.log(selectedImage);

  return (
    <Card className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Student List</h1>
      <div className="flex justify-between mb-4">
        <div className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Search Student..."
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSingleAdd}>
                <UserPlus className="mr-2 h-4 w-4" />
                Single Add
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMultipleAdd}>
                <Users className="mr-2 h-4 w-4" />
                Multiple Add
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="flex items-center gap-2">
            Export
            <FolderOutput className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table component */}
      <CustomDataTable
        data={studentList}
        itemsPerPage={5}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add List of Students</DialogTitle>
            <DialogDescription>
              Upload a file to add multiple students. Only .csv and .xlsx files
              are accepted.
            </DialogDescription>
          </DialogHeader>
          <div
            {...getRootProps()}
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <File className="mx-auto h-12 w-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2 text-sm text-gray-600">
                Drop the files here ...
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Drag &apos;n&apos; drop some files here, or click to select
                files
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Only .csv and .xlsx files are accepted
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Single Add Dialog */}
      <Dialog open={showSingleAdd} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Add a single student to the course.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="mx-auto flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-gray-500" />
              </div>
              <div className="mt-2">
                <Input
                  type="file"
                  id="imagefile"
                  name="imagefile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-64"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label htmlFor="tup_id" className="text-right">
                TUP ID
              </Label>
              <Input id="tup_id" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label htmlFor="school_year" className="text-right">
                School Year
              </Label>
              <Input id="school_year" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View student details.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-8">
            <div>
              {studentDetails?.profile_image ? (
                <Image
                  src={studentDetails?.profile_image}
                  alt="Instructor Profile Picture"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="h-16 w-16 text-gray-500" />
                </div>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <p className="font-semibold">Name:</p>
                <p>{studentDetails?.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold">Email:</p>
                <p>{studentDetails?.school_year}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">TUP ID:</p>
                <p>{studentDetails?.tup_id}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">Status:</p>
                {studentDetails?.isValid ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white rounded-full">
                    Valid
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                    Not Valid
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
            <DialogDescription>
              Make changes to the student&apos;s information here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="mx-auto flex flex-col items-center">
              <div>
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg"
                    priority
                  />
                ) : studentDetails?.profile_image ? (
                  <Image
                    src={studentDetails.profile_image}
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
              <div className="mt-2">
                <Input
                  type="file"
                  id="imagefile"
                  name="imagefile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-64"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tup_id" className="text-right">
                TUP ID
              </Label>
              <Input
                id="tup_id"
                value={editFormData.tup_id}
                className="col-span-3"
                onChange={(e) =>
                  setEditFormData({ ...editFormData, tup_id: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="school_year" className="text-right">
                School Year
              </Label>
              <Input
                id="school_year"
                value={editFormData.school_year}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    school_year: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                <Badge
                  className={
                    editFormData.isValid
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }
                >
                  {editFormData.isValid ? 'Validated' : 'Not Validated'}
                </Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
