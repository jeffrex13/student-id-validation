import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import Logo from '../../../public/images/logo.png';
import { menuItems } from '@/lib/menuItems';

const SidebarContent: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();

  return (
    <div className={cn('relative flex flex-col h-screen', className)}>
      <div
        className={cn(
          'flex-grow transition-all duration-300 ease-in-out border-r border-gray-300 dark:border-0 bg-card px-4 w-56',
        )}
      >
        <div
          className={cn(
            'flex justify-center items-center p-4 transition-all duration-300 ease-in-out',
          )}
        >
          <div
            className={cn('transition-all duration-300 ease-in-out w-24 h-24')}
          >
            <Image
              className="mx-auto object-contain transition-all duration-300 ease-in-out"
              src={Logo}
              alt="Logo"
              width={90}
              height={90}
              priority
            />
          </div>
        </div>
        <ScrollArea className="flex-1 pt-4">
          <div className="space-y-2 px-2">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path} passHref>
                <Button
                  variant={pathname === item.path ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-base h-10 mb-4',
                    pathname !== item.path && 'text-gray-700 dark:text-white',
                  )}
                >
                  <span className="ml-3">{item.name.toUpperCase()}</span>
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SidebarContent;
