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
// import ThemeToggle from './ThemeToggle';
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
          setUserName(res?.userName);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    const response = await logout();
    if (response.success) {
      // Clear user state
      setUserName(undefined); // or set it to an empty string
      // Optionally, you can also clear other user-related states if needed
      // Redirect to login after logout
      router.push('/login');
    } else {
      // Handle logout error if needed
      console.error('Logout failed:', response.message);
    }
  };

  return (
    <div className="flex items-center justify-end p-4 gap-4">
      {/* <ThemeToggle /> */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#8F001C] text-white">
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
