import React from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface DialogProps {
  studentData: {
    name: string;
    tup_id: string;
    school_year: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
  actionType?: 'validate' | 'scan';
}

const CustomDialog = ({
  studentData,
  open,
  setOpen,
  actionType,
}: DialogProps) => {
  console.log(studentData);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          <div>
            <p>Name: {studentData.name}</p>
            <p>ID: {studentData.tup_id}</p>
            <p>School Year: {studentData.school_year}</p>
          </div>
          <DialogFooter>
            {actionType === 'validate' && <Button>Validate</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomDialog;
