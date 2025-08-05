import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: any;
  refetch: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const initialLoadRef = useRef(true);
  
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
        });
        
        if (response.status === 401) {
          return null;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
        }
        return result;
      } catch (error) {
        console.error('Auth check failed:', error);
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
        }
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
    networkMode: 'online',
  });

  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ['auth-user'] });
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || initialLoadRef.current,
    isAuthenticated: !!user,
    error,
    refetch,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
