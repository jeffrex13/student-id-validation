'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
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
  Trash2,
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
import { debounce } from 'lodash';
// import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface TableContainerProps {
  course: 'cafa' | 'cie' | 'cit' | 'cla' | 'coe' | 'cos';
}

const courseNames: Record<string, string> = {
  cafa: 'COLLEGE OF ARCHITECTURE AND FINE ARTS',
  cie: 'COLLEGE OF INDUSTRIAL EDUCATION',
  cit: 'COLLEGE OF INDUSTRIAL TECHNOLOGY',
  cla: 'COLLEGE OF LIBERAL ARTS',
  coe: 'COLLEGE OF ENGINEERING',
  cos: 'COLLEGE OF SCIENCE',
};

export default function TableContainer({ course }: TableContainerProps) {
  const { toast } = useToast();
  const [studentList, setStudentList] = useState<any>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSingleAdd, setShowSingleAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [addSingleStudentData, setAddSingleStudentData] = useState<Student>({
    _id: '',
    profile_image: '',
    name: '',
    tup_id: '',
    school_year: '',
    isValid: false,
    semester: '',
  });
  const [editFormData, setEditFormData] = useState<Student>({
    _id: '',
    profile_image: '',
    name: '',
    tup_id: '',
    school_year: '',
    isValid: false,
    semester: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteAllConfirmation, setShowDeleteAllConfirmation] =
    useState(false);

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
            description: `File uploaded successfully! ${response.data.message}`,
            variant: 'default',
            duration: 3000,
          });
          console.log('File uploaded successfully:', response.data);
        } catch (error: any) {
          console.error('Error uploading file:', error);
          toast({
            title: 'Error',
            description: `${error.response.data.message}.Please try again.`,
            variant: 'destructive',
            duration: 5000,
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
        setStudentList([]);
      }
    };

    fetchStudents();
  };

  const handleSingleAdd = () => {
    setShowSingleAdd(true);
  };

  const handleMultipleAdd = () => {
    setShowFileUpload(true);
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
    setStudentToDelete(student);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirmation(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/student/delete-all/${course}`,
      );
      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default',
        duration: 3000,
      });
      setShowDeleteAllConfirmation(false);
      refreshData();
    } catch (error: any) {
      console.error('Error deleting students:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected students. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      setShowDeleteAllConfirmation(false);
      refreshData();
    }
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/student/${studentToDelete._id}`,
      );
      if (response.data) {
        toast({
          title: 'Success',
          description: 'Student deleted successfully!',
          variant: 'default',
          duration: 3000,
        });
        setShowDeleteConfirmation(false);
        setStudentToDelete(null);
      }
      refreshData();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      refreshData();
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: 'Error',
        description: 'No students selected for deletion.',
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/student/ids/bulk`,
        {
          data: { studentIds: selectedIds }, // Wrap selectedIds in an object
        },
      );

      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default',
        duration: 3000,
      });
      setSelectedIds([]); // Clear selected IDs after deletion
      refreshData(); // Refresh the student list
    } catch (error) {
      console.error('Error deleting students:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete selected students. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];

  //   if (file) {
  //     // Check file size (e.g., max 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       toast({
  //         title: 'Error',
  //         description: 'File size should be less than 5MB',
  //         variant: 'destructive',
  //       });
  //       return;
  //     }

  //     // Check file type
  //     if (!file.type.startsWith('image/')) {
  //       toast({
  //         title: 'Error',
  //         description: 'Please select an image file',
  //         variant: 'destructive',
  //       });
  //       return;
  //     }

  //     // Proceed with file processing
  //     // setImageFile(file);
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       const base64String = reader.result as string;
  //       setSelectedImage(base64String);
  //     };

  //     reader.onerror = () => {
  //       toast({
  //         title: 'Error',
  //         description: 'Error reading file',
  //         variant: 'destructive',
  //       });
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };

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

  // Edit Submit
  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/student/${editFormData._id}`,
        {
          profile_image: selectedImage ?? editFormData.profile_image,
          name: editFormData.name,
          tup_id: editFormData.tup_id,
          school_year: editFormData.school_year,
          isValid: editFormData.isValid,
          semester: editFormData.semester,
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
        setSelectedImage(null);
        setEditFormData({
          _id: '',
          name: '',
          tup_id: '',
          school_year: '',
          isValid: false,
          semester: '',
        });
        refreshData(); // Refresh the table data
      }
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: `${error.response.data.message}`,
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  const handleSingleSubmit = async () => {
    try {
      const studentData = {
        profile_image: selectedImage, // Image URL or base64 string
        tup_id: addSingleStudentData.tup_id, // TUP ID
        name: addSingleStudentData.name, // Name
        school_year: addSingleStudentData.school_year, // School year
        isValid: false, // Set default validity or adjust as needed
        semester: addSingleStudentData.semester,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/student/${course}`, // Adjust the endpoint as needed
        studentData,
        {
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
        },
      );

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Student added successfully!',
          variant: 'default',
          duration: 3000,
        });
        setShowSingleAdd(false); // Close the dialog
        refreshData(); // Refresh the student list
        // Reset form data if necessary
        setAddSingleStudentData({
          _id: '',
          name: '',
          tup_id: '',
          school_year: '',
          isValid: false,
        });
        setSelectedImage(null); // Clear the selected image
      }
    } catch (error: any) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error',
        description: `${error.response.data.message}. Please try again`,
        variant: 'destructive',
        duration: 5000,
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
          `${process.env.NEXT_PUBLIC_API}/student/${course}?search=${searchQuery}`,
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
  }, [course, searchQuery]);

  useEffect(() => {
    if (studentDetails) {
      setEditFormData({
        _id: studentDetails._id,
        name: studentDetails.name,
        tup_id: studentDetails.tup_id,
        school_year: studentDetails.school_year,
        isValid: studentDetails.isValid,
        profile_image: studentDetails.profile_image,
        semester: studentDetails.semester,
      });
    }
  }, [studentDetails]);

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 500),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Card className="container mx-auto p-6">
      <h1 className="text-2xl text-center font-semibold mb-12">
        {courseNames[course]}
      </h1>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <div className="relative max-w-md w-full">
          <Input
            type="text"
            placeholder="Search Student..."
            className="pr-10"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDeleteSelected}
            className="border-destructive text-destructive flex-grow md:flex-grow-0 hover:bg-destructive hover:text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>

          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className="border-destructive text-destructive flex-grow md:flex-grow-0 hover:bg-destructive hover:text-white" // Simplified className
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-grow md:flex-grow-0">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSingleAdd}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMultipleAdd}>
                <Users className="mr-2 h-4 w-4" />
                Add Student List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            disabled
            className="flex-grow md:flex-grow-0"
          >
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
        selectedIds={selectedIds} // Pass selected IDs
        handleCheckboxChange={handleCheckboxChange} // Pass checkbox change handler
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

              <div className="mt-2 space-y-2 ">
                <Input
                  type="file"
                  id="imagefile"
                  name="imagefile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-64"
                />
                <p className="text-xs font-medium text-gray-600">
                  Note: Max image size should not exceed 1 mb.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label htmlFor="tup_id" className="text-right">
                TUP ID
              </Label>
              <Input
                id="tup_id"
                className="col-span-3"
                onChange={(e) =>
                  setAddSingleStudentData({
                    ...addSingleStudentData,
                    tup_id: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) =>
                  setAddSingleStudentData({
                    ...addSingleStudentData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label htmlFor="school_year" className="text-right">
                School Year
              </Label>
              <Input
                id="school_year"
                className="col-span-3"
                onChange={(e) =>
                  setAddSingleStudentData({
                    ...addSingleStudentData,
                    school_year: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label className="text-right">Semester</Label>
              <div className="col-span-3">
                <RadioGroup
                  value={addSingleStudentData.semester}
                  onValueChange={(value) =>
                    setAddSingleStudentData({
                      ...addSingleStudentData,
                      semester: value,
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1st Semester" id="1st-semester" />
                    <Label htmlFor="1st-semester">1st Semester</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2nd Semester" id="2nd-semester" />
                    <Label htmlFor="2nd-semester">2nd Semester</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSingleSubmit}>Add Student</Button>
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
                <p>{studentDetails?.name ?? 'N/A'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Semester:</p>
                  <p>{studentDetails?.semester ?? 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold">School year:</p>
                <p>{studentDetails?.school_year ?? 'N/A'}</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-semibold">TUP ID:</p>
                <p>{studentDetails?.tup_id ?? 'N/A'}</p>
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
              <div className="mt-2 space-y-2 text-center">
                <Input
                  type="file"
                  id="imagefile"
                  name="imagefile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-64"
                />
                <p className="text-xs font-medium text-gray-600">
                  Note: Max image size should not exceed 1 mb.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tup_id" className="text-right">
                TUP ID
              </Label>
              <Input
                id="tup_id"
                value={editFormData.tup_id ?? 'N/A'}
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
                value={editFormData.name ?? 'N/A'}
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
                value={editFormData.school_year ?? 'N/A'}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    school_year: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2 mx-4">
              <Label className="text-right">Semester</Label>
              <div className="col-span-3">
                <RadioGroup
                  value={editFormData.semester}
                  onValueChange={(value) =>
                    setEditFormData({
                      ...editFormData,
                      semester: value,
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1st Semester" id="1st-semester" />
                    <Label htmlFor="1st-semester">1st Semester</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2nd Semester" id="2nd-semester" />
                    <Label htmlFor="2nd-semester">2nd Semester</Label>
                  </div>
                </RadioGroup>
              </div>
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
                  {editFormData.isValid ? 'Validated' : 'Not Valid'}
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

      {/* delete confirmation dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete {studentToDelete?.name}? This action
            cannot be undone.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete all confirmation dialog */}
      <Dialog
        open={showDeleteAllConfirmation}
        onOpenChange={setShowDeleteAllConfirmation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm">
            Are you sure you want to delete all students? This action cannot be
            undone.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteAllConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteAll}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
