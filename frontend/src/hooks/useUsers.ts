import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../services/userService';
import type { UserDetailDto } from '../services/userService';

interface UseUsersOptions {
  is_active?: boolean;
  limit?: number;
  enabled?: boolean;
}

interface UseUsersReturn {
  users: UserDetailDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
  const { is_active, limit, enabled = true } = options;
  const [users, setUsers] = useState<UserDetailDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const usersList = await getUsers({ is_active, limit });
      setUsers(usersList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      setUsers([]);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [is_active, limit, enabled]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};

