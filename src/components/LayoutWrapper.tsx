'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './SideBar';
import AppBar from './AppBar';
import { ThemeProvider } from '@/app/providers';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex h-screen">
      <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
      {!isLoginPage && <Sidebar />}

      <main className="flex-1 overflow-y-auto">
        {!isLoginPage && <AppBar />}
        {children}
      </main>
      </ThemeProvider>
    </div>
  );
}
