'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar/Sidebar';
import AppBar from './AppBar';
import { ThemeProvider } from '@/app/providers';

export default function Component({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/student-scan';

  const customBackground = pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex h-screen relative">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {/* Sidebar with higher z-index */}
        <div className="relative z-50">{!isAuthPage && <Sidebar />}</div>

        <main className="flex-1 overflow-y-auto bg-gray-100">
          {/* AppBar with higher z-index */}
          <div className="relative z-50">{!isAuthPage && <AppBar />}</div>

          {/* Background layers */}
          {customBackground && (
            <div className="fixed inset-0 z-0">
              {/* Top section - Maroon */}
              <div className="w-full h-[85%] bg-rose-600" />
              {/* Bottom section - Gray */}
              <div className="w-full h-[15%] bg-gray-100" />
              {/* Curved separator */}
              <div className="absolute bottom-[15%] left-0 right-0 w-full overflow-hidden">
                <svg
                  viewBox="0 0 1440 300"
                  className="w-full h-[300px]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,160 C480,400 960,-100 1440,160 L1440,400 L0,400 Z"
                    className="fill-gray-100"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-10">{children}</div>
        </main>
      </ThemeProvider>
    </div>
  );
}
