export interface Student {
  _id: string;
  name: string;
  school_year: string;
  tup_id: string;
  isValid: boolean;
  profile_image?: string;
  semester?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: keyof Student | null;
  direction: SortDirection;
}

export interface CustomTableProps {
  data: Student[];
  itemsPerPage?: number;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
}

export interface DialogProps {
  studentData: Student;
  open: boolean;
  setOpen: (open: boolean) => void;
  actionType?: 'validate' | 'scan';
}
