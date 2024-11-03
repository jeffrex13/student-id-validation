import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Toaster } from '@/components/ui/toaster';
import { NProgressProvider } from '@/components/NProgressProvider';
import '@/styles/nprogress.css';
import { Suspense } from 'react';

const inter = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student ID Validation',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <NProgressProvider />
          <main className="flex-1">
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster />
          </main>
        </Suspense>
      </body>
    </html>
  );
}
