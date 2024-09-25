'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

type User = {
  username: string;
  password: string;
  token?: string;
  // Add other user properties as needed
};

type AuthContextType = {
  user: User | null;
  login: ({
    username,
    password,
  }: User) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing user session on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async ({ username, password }: User) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/auth/login`,
        {
          username,
          password,
        },
      );

      // Assuming the token is in response.data.token
      const token = response.data.token;
      const decodedToken = jwtDecode<User>(token);

      // Store the decoded token and the original token in the user state and localStorage
      const userWithToken = { ...decodedToken, token };
      setUser(userWithToken);
      console.log(user);
      localStorage.setItem('user', JSON.stringify(userWithToken));

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
