import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();
  
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
        return result;
      } catch (error) {
        console.error('Auth check failed:', error);
        return null;
      }
    },
    retry: false,
  });

  const refreshAuth = () => {
    queryClient.invalidateQueries({ queryKey: ['auth-user'] });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    refetch,
    refreshAuth,
  };
}
