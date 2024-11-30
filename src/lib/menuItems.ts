export interface MenuItem {
  name: string;
  path: string;
  adminAccess?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/',
    adminAccess: true,
  },
  {
    name: 'Scan ID',
    path: '/home',
    adminAccess: true,
  },
  {
    name: 'Users',
    path: '/users',
    adminAccess: false,
  },
  {
    name: 'cafa',
    path: '/cafa',
    adminAccess: true,
  },
  {
    name: 'cie',
    path: '/cie',
    adminAccess: true,
  },
  {
    name: 'cit',
    path: '/cit',
    adminAccess: true,
  },
  {
    name: 'cla',
    path: '/cla',
    adminAccess: true,
  },
  {
    name: 'coe',
    path: '/coe',
    adminAccess: true,
  },
  {
    name: 'cos',
    path: '/cos',
    adminAccess: true,
  },
];
