import TableContainer from '@/components/course-components/TableContainer';
import React from 'react';

const page = () => {
  return (
    <div className="pt-14">
      <p className="text-2xl font-semibold text-center mb-8">
        COLLEGE OF SCIENCE
      </p>
      <TableContainer course="cos" />
    </div>
  );
};

export default page;
