import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import { Montserrat } from 'next/font/google';
import './globals.css'; // Adjust the path as necessary
import LayoutWrapper from '@/components/LayoutWrapper';

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
        <main className="flex-1">
          <LayoutWrapper>{children}</LayoutWrapper>
        </main>
      </body>
    </html>
  );
}
