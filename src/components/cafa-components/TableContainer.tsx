'use client';

import { useEffect, useState } from 'react';
import CustomDataTable from '../CustomTable';
import axios from 'axios';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FolderOutput, Search } from 'lucide-react';

export default function TableContainer() {
  const [studentList, setStudentList] = useState<any>([]);

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
          <Button>Add Student</Button>
          <Button variant="outline" className="flex items-center gap-2">
            Export
            <FolderOutput className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CustomDataTable data={studentList} itemsPerPage={5} />
    </Card>
  );
}
