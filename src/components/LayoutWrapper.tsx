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

  const authCustomBackground = pathname === '/login' || pathname === '/signup';

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

        <main className="flex-1 overflow-y-auto bg-gray-200">
          {/* AppBar with higher z-index */}
          <div className="relative z-50">{!isAuthPage && <AppBar />}</div>

          {/* Background layers */}
          {pathname !== '/student-scan' &&
            (authCustomBackground ? (
              <div className="fixed inset-0 z-0">
                {/* Top section - Maroon */}
                <div className="w-full h-[85%] bg-rose-600" />
                {/* Bottom section - Gray */}
                <div className="w-full h-[15%] bg-gray-200" />
                {/* Curved separator */}
                <div className="absolute bottom-[15%] left-0 right-0 w-full overflow-hidden">
                  <svg
                    viewBox="0 0 1440 300"
                    className="w-full h-[300px]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,160 C480,400 960,-100 1440,160 L1440,400 L0,400 Z"
                      className="fill-gray-200"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 z-0">
                {/* Base background - Red */}
                <div className="w-full h-full bg-rose-600" />

                {/* Gray area with sweeping curve */}
                <div className="absolute top-0 left-0 right-0 w-full h-[8%] bg-gray-200">
                  <svg
                    viewBox="0 0 1440 400"
                    className="absolute bottom-0 w-full h-[400px] translate-y-[60%]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,0 L1440,0 L1440,400 C1200,400 600,20 0,400 L0,0"
                      className="fill-gray-200"
                    />
                  </svg>
                </div>
              </div>
            ))}

          {/* Content */}
          <div className="relative z-10">{children}</div>
        </main>
      </ThemeProvider>
    </div>
  );
}
