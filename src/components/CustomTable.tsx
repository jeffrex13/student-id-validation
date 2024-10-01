// 'use client';

// import React, { useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

// type DataItem = {
//   _id: number;
//   name: string;
//   school_year: string;
//   tup_id: string;
// };

// type SortDirection = 'asc' | 'desc' | null;

// type SortState = {
//   column: keyof DataItem | null;
//   direction: SortDirection;
// };

// type CustomDataTableProps = {
//   data: DataItem[];
//   itemsPerPage?: number;
// };

// export default function CustomDataTable({
//   data,
//   itemsPerPage = 5,
// }: CustomDataTableProps) {
//   const [sortState, setSortState] = useState<SortState>({
//     column: null,
//     direction: null,
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSort = (column: keyof DataItem) => {
//     setSortState((prevState) => ({
//       column,
//       direction:
//         prevState.column === column && prevState.direction === 'asc'
//           ? 'desc'
//           : 'asc',
//     }));
//   };

//   const sortedData = React.useMemo(() => {
//     if (sortState.column) {
//       return [...data].sort((a, b) => {
//         if (a[sortState.column!] < b[sortState.column!])
//           return sortState.direction === 'asc' ? -1 : 1;
//         if (a[sortState.column!] > b[sortState.column!])
//           return sortState.direction === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }
//     return data;
//   }, [data, sortState]);

//   const filteredData = React.useMemo(() => {
//     return sortedData.filter((item) =>
//       Object.values(item).some((value) =>
//         value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
//       ),
//     );
//   }, [sortedData, searchTerm]);

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = filteredData.slice(startIndex, endIndex);

//   const renderSortIcon = (column: keyof DataItem) => {
//     if (sortState.column !== column) {
//       return <ChevronsUpDown className="ml-2 h-4 w-4" />;
//     }
//     return sortState.direction === 'asc' ? (
//       <ChevronUp className="ml-2 h-4 w-4" />
//     ) : (
//       <ChevronDown className="ml-2 h-4 w-4" />
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <Input
//         placeholder="Search..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="max-w-sm"
//       />
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {['ID', 'name', 'school year'].map((column) => (
//                 <TableHead
//                   key={column}
//                   className="font-medium bg-rose-600 text-white"
//                 >
//                   <Button
//                     variant="ghost"
//                     onClick={() => handleSort(column as keyof DataItem)}
//                     className="flex items-center"
//                   >
//                     {column.charAt(0).toUpperCase() + column.slice(1)}
//                     {renderSortIcon(column as keyof DataItem)}
//                   </Button>
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {currentData.map((item) => (
//               <TableRow key={item._id}>
//                 <TableCell>{item.tup_id}</TableCell>
//                 <TableCell>{item.name}</TableCell>
//                 <TableCell>{item.school_year}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="text-sm">
//             Showing {startIndex + 1} to{' '}
//             {Math.min(endIndex, filteredData.length)} of {filteredData.length}{' '}
//             entries
//           </p>
//         </div>
//         <div className="space-x-2">
//           <Button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <Button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

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
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Image1 from '../../public/images/test-image.png';
import Image2 from '../../public/images/test-image1.png';
import Image3 from '../../public/images/test-image2.png';
import Image4 from '../../public/images/test-image3.png';

import Image from 'next/image';

type DataItem = {
  _id: number;
  name: string;
  school_year: string;
  tup_id: string;
};

type SortDirection = 'asc' | 'desc' | null;

type SortState = {
  column: keyof DataItem | null;
  direction: SortDirection;
};

type CustomDataTableProps = {
  data: DataItem[];
  itemsPerPage?: number;
};

export default function CustomDataTable({
  data,
  itemsPerPage = 5,
}: CustomDataTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const ImageArray = [Image1, Image2, Image3, Image4];

  const handleSort = (column: keyof DataItem) => {
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

  const renderSortIcon = (column: keyof DataItem) => {
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
              {['image', 'ID', 'name', 'school year', 'QR Code'].map(
                (column) => (
                  <TableHead key={column} className="font-medium">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column as keyof DataItem)}
                      className="flex items-center pl-4"
                    >
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                      {renderSortIcon(column as keyof DataItem)}
                    </Button>
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>
                  {index < ImageArray.length ? (
                    <Image
                      src={ImageArray[index]}
                      alt={`student-image-${index}`}
                      className="w-12 h-12"
                    />
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>{item.tup_id || 'N/A'}</TableCell>
                <TableCell>{item.name || 'N/A'}</TableCell>
                <TableCell>{item.school_year || 'N/A'}</TableCell>
                <TableCell className="text-center">
                  <QRCodeSVG value={item.tup_id} size={40} className="ml-6" />
                </TableCell>
              </TableRow>
            ))}
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
