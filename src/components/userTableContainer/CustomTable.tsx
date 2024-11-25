'use client';

import React, { useEffect, useState } from 'react';
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
  Pencil,
  Trash,
  Eye,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Users, SortUsers, CustomUserTableProps } from '@/types';
import { getUser } from '@/app/actions/auth';

export default function CustomDataTable({
  data,
  itemsPerPage = 5,
  currentPage,
  setCurrentPage,
  onView,
  onEdit,
  onDelete,
}: CustomUserTableProps) {
  const [sortState, setSortState] = useState<SortUsers>({
    column: null,
    direction: null,
  });
  const [userId, setUserId] = useState<string>('');

  const handleSort = (column: keyof Users) => {
    if (column === 'name') {
      setSortState((prevState) => ({
        column,
        direction:
          prevState.column === column && prevState.direction === 'asc'
            ? 'desc'
            : 'asc',
      }));
    }
  };

  const sortedData = React.useMemo(() => {
    if (sortState.column) {
      return [...data].sort((a, b) => {
        const column = sortState.column as keyof Users;
        const aValue = a[column] ?? '';
        const bValue = b[column] ?? '';

        const aString = String(aValue);
        const bString = String(bValue);

        if (aString < bString) {
          return sortState.direction === 'asc' ? -1 : 1;
        }
        if (aString > bString) {
          return sortState.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortState]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const renderSortIcon = (column: keyof Users) => {
    if (column === 'name') {
      if (sortState.column !== column) {
        return <ChevronsUpDown className="ml-2 h-4 w-4" />;
      }
      return sortState.direction === 'asc' ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-2 h-4 w-4" />
      );
    }
    return null;
  };

  // Function to convert createdAt date string to a readable format
  const formatCreatedAt = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUser();
      if (data) {
        setUserId(data.userId);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="px-3">
        <Table className="">
          <TableHeader className="">
            <TableRow className="">
              {['date created', 'name', 'username'].map((column) => (
                <TableHead key={column} className="font-medium">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column as keyof Users)}
                    className={`flex items-center pl-4 ${
                      column !== 'name' && 'cursor-default hover:bg-transparent'
                    }`}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {renderSortIcon(column as keyof Users)}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {formatCreatedAt(item.createdAt!) || 'N/A'}
                  </TableCell>
                  <TableCell>{item.name || 'N/A'}</TableCell>
                  <TableCell>{item.username || 'N/A'}</TableCell>
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
                        {/* <DropdownMenuItem
                          onClick={() => onDelete && onDelete(item)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem> */}
                        {userId !== item._id && ( // Check if userId is not equal to item._id
                          <DropdownMenuItem
                            onClick={() => onDelete && onDelete(item)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
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
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
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
