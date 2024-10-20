import React from 'react';
import TableContainer from '@/components/course-components/TableContainer';
const page = () => {
  return (
    <div className="pt-14">
      <p className="text-2xl font-semibold text-center mb-8">
        COLLEGE OF INDUSTRIAL TECHNOLOGY
      </p>
      <TableContainer course="cit" />
    </div>
  );
};

export default page;
