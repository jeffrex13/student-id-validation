'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './SideBar';
import AppBar from './AppBar';
import { ThemeProvider } from '@/app/providers';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/student-scan';

  return (
    <div className="flex h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {!isAuthPage && <Sidebar />}

        <main className="flex-1 overflow-y-auto bg-gray-100">
          {!isAuthPage && <AppBar />}
          {children}
        </main>
      </ThemeProvider>
    </div>
  );
}
