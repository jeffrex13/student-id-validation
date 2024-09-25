'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Menu } from 'lucide-react';

import Logo from '../../public/images/logo.png';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [{ icon: Home, label: 'Home', href: '/' }];

export function Sidebar({ className }: SidebarProps) {
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={cn('relative flex flex-col h-screen', className)}>
      <div
        className={cn(
          'flex-grow',
          'transition-all duration-300 ease-in-out',
          'border-r border-gray-300 dark:border-0 bg-card px-4',
          // isCollapsed ? 'w-20' : 'w-64',
          'w-56',
        )}
      >
        <div
          className={cn(
            'flex justify-center items-center p-4',
            'transition-all duration-300 ease-in-out',
          )}
        >
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              // isCollapsed ? 'w-12 h-12' : 'w-24 h-24',
              'w-24 h-24',
            )}
          >
            <Image
              className="mx-auto object-contain transition-all duration-300 ease-in-out"
              src={Logo}
              alt="Logo"
              // width={isCollapsed ? 48 : 96}
              width={90}
              // height={isCollapsed ? 48 : 96}
              height={90}
              priority
            />
          </div>
        </div>
        <ScrollArea className="flex-1 pt-4">
          <div className="space-y-2 px-2">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  // variant="ghost"
                  className={cn(
                    'w-full justify-start text-base transition-all duration-300 ease-in-out h-10',
                    // isCollapsed && 'justify-center',
                    pathname === item.href && 'bg-rose-700 text-white',
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0 transition-all duration-300 ease-in-out" />
                  {/* {!isCollapsed && (
                    <span className="ml-3 transition-all duration-300 ease-in-out">
                      {item.label.toUpperCase()}
                    </span>
                  )} */}
                  <span className="ml-3 transition-all duration-300 ease-in-out">
                    {item.label.toUpperCase()}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          'absolute -right-4 bg-red-50 border border-red-200 rounded-full p-1 hover:bg-red-100 transition-all duration-300 ease-in-out',
          isCollapsed ? 'top-14' : 'top-20',
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button> */}
    </div>
  );
}

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
