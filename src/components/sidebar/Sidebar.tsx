'use client';

import React, { lazy, Suspense } from 'react'; // Import lazy and Suspense
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

// Lazy load the Sidebar component
const SidebarComponent = lazy(() => import('./SidebarContent'));

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Fallback UI while loading */}
      <SidebarComponent className={className} />
    </Suspense>
  );
};

export function SidebarMobile() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
