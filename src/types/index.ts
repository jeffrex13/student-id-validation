export interface Users {
  createdAt?: string;
  _id: string;
  name: string;
  username: string;
  password?: string;
  userType: string;
}

export interface Student {
  _id: string;
  name: string;
  school_year: string;
  tup_id: string;
  isValid: boolean;
  profile_image?: string;
  semester?: string;
  dateValidated?: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: keyof Student | Users | null;
  direction: SortDirection;
}

export interface SortUsers {
  column: keyof Users | null;
  direction: SortDirection;
}

export interface CustomTableProps {
  data: Student[];
  itemsPerPage?: number;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  onDelete?: (student: Student) => void;
  selectedIds?: string[];
  handleCheckboxChange?: (id: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export interface CustomUserTableProps {
  data: Users[];
  itemsPerPage?: number;
  onView?: (student: Users) => void;
  onEdit?: (student: Users) => void;
  onDelete?: (student: Users) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export interface DialogProps {
  studentData: Student;
  open: boolean;
  setOpen: (open: boolean) => void;
  actionType?: 'validate' | 'scan';
}

export interface CourseStats {
  total: number;
  valid: number;
  invalid: number;
  noValidationField: number;
}

export interface ValidationStats {
  total: number;
  valid: number;
  invalid: number;
  noValidationField: number;
  courseStats: {
    [key: string]: CourseStats;
  };
}
