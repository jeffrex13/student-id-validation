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
} from '../ui/dialog';

export default function TableContainer() {
  const [studentList, setStudentList] = useState<any>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  // const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the uploaded files here
    console.log(acceptedFiles);
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
        formData.append('course', 'cafa'); // Append the file type to the FormData

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
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
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

  const handleSingleAdd = () => {
    setShowFileUpload(false);
    // Implement single add logic here
    console.log('Single add selected');
  };

  const handleMultipleAdd = () => {
    setShowFileUpload(true);
    // Implement multiple add logic here
    console.log('Multiple add selected');
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/student/cafa`,
        );
        setStudentList(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

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
      <CustomDataTable data={studentList} itemsPerPage={5} />

      <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
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
    </Card>
  );
}
