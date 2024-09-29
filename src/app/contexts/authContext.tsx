'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

type User = {
  username?: string; // Made optional to accommodate both contexts
  name?: string; // Add other user properties as needed
  token?: string;
  password?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async ({ username, password }: User) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        { username, password },
      );

      const token = response.data.token;
      const decodedToken = jwtDecode<User>(token);

      const userWithToken = { ...decodedToken, token, username }; // Merge both contexts
      setUser(userWithToken);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      router.push('/');

      return { success: true, message: 'Login successful' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message:
            error.response?.data?.message || 'Invalid username or password',
        };
      }
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
