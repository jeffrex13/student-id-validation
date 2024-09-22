import type { Metadata } from 'next';
// import localFont from 'next/font/local';
import { Montserrat } from 'next/font/google';
import './globals.css'; // Adjust the path as necessary
import LayoutWrapper from '@/components/LayoutWrapper';
// import { ThemeProvider } from './providers';

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
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <LayoutWrapper>{children}</LayoutWrapper>
          {/* </ ThemeProvider> */}
        </main>
        
      </body>
      
    </html>
  );
}
