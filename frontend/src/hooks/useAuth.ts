import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';

export function useAuth() {
  const { login, clear, loginStatus, identity, isLoggingIn, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const logout = useCallback(async () => {
    await clear();
    queryClient.clear();
  }, [clear, queryClient]);

  return {
    login,
    logout,
    isAuthenticated,
    isLoggingIn,
    isInitializing,
    loginStatus,
    identity,
    principalId: identity?.getPrincipal().toString(),
  };
}
