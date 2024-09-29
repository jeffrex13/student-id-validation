'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getUser, logout } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function AppBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [userName, setUserName] = useState<string | undefined>('');

  useEffect(() => {
    const getUserData = async () => {
      await getUser()
        .then((res) => {
          console.log(res);
          setUserName(res?.userName);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-end p-4 gap-4">
      <ThemeToggle />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {userName ? userName.charAt(0) : 'John Doe'.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <User className=" " />
                <p className="text-sm font-medium leading-none">
                  {userName ? userName : 'John Doe'}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
