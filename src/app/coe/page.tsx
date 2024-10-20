import React from 'react';
import TableContainer from '@/components/course-components/TableContainer';
const page = () => {
  return (
    <div className="pt-14">
      <p className="text-2xl font-semibold text-center mb-8">
        COLLEGE OF ENGINEERING
      </p>
      <TableContainer course="coe" />
    </div>
  );
};

export default page;
