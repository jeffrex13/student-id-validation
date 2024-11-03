'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  User,
  Pencil,
  Trash,
  Eye,
  MoreVertical,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
// import Image1 from '../../public/images/test-image.png';
// import Image2 from '../../public/images/test-image1.png';
// import Image3 from '../../public/images/test-image2.png';
// import Image4 from '../../public/images/test-image3.png';

import Image from 'next/image';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Student, SortState, CustomTableProps } from '@/types';

export default function CustomDataTable({
  data,
  itemsPerPage = 5,
  onView,
  onEdit,
  onDelete,
}: CustomTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const ImageArray: string[] = [];

  const handleSort = (column: keyof Student) => {
    setSortState((prevState) => ({
      column,
      direction:
        prevState.column === column && prevState.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const sortedData = React.useMemo(() => {
    if (sortState.column) {
      return [...data].sort((a, b) => {
        if (a[sortState.column!] < b[sortState.column!])
          return sortState.direction === 'asc' ? -1 : 1;
        if (a[sortState.column!] > b[sortState.column!])
          return sortState.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [data, sortState]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const renderSortIcon = (column: keyof Student) => {
    if (sortState.column !== column) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return sortState.direction === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="px-3">
        <Table className="">
          <TableHeader className="">
            <TableRow className="">
              {[
                'image',
                'ID',
                'name',
                'school year',
                'status',
                'qr Code',
                'actions',
              ].map((column) => (
                <TableHead key={column} className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column as keyof Student)}
                    className="flex items-center pl-4"
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {renderSortIcon(column as keyof Student)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {index < ImageArray.length ? (
                      <Image
                        src={ImageArray[index]}
                        alt={`student-image-${index}`}
                        className="w-12 h-12"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full p-1">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.tup_id || 'N/A'}</TableCell>
                  <TableCell>{item.name || 'N/A'}</TableCell>
                  <TableCell>{item.school_year || 'N/A'}</TableCell>
                  <TableCell>
                    {item.isValid ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white rounded-full">
                        Valid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full">
                        Invalid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <QRCodeSVG value={item.tup_id} size={40} className="ml-6" />
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onView && onView(item)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit && onEdit(item)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete && onDelete(item)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)}{' '}
            of {sortedData.length} entries
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
