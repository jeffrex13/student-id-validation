import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import { Montserrat } from 'next/font/google';
import './globals.css'; // Adjust the path as necessary
import LayoutWrapper from '@/components/LayoutWrapper';
import { Toaster } from '@/components/ui/toaster';
// import { AuthProvider } from './contexts/authContext';
// import { ThemeProvider } from './providers';
import { NProgressProvider } from '@/components/NProgressProvider';
import '@/styles/nprogress.css'; // Add this import

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
        <NProgressProvider />
        <main className="flex-1 ">
          {/* <AuthProvider> */}
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
          {/* </AuthProvider> */}
        </main>
      </body>
    </html>
  );
}
