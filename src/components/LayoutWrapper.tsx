'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './SideBar';
import AppBar from './AppBar';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex h-screen">
      {!isLoginPage && <Sidebar />}

      <main className="flex-1 overflow-y-auto">
        {!isLoginPage && <AppBar />}
        {children}
      </main>
    </div>
  );
}
