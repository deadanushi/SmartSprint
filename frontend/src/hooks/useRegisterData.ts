import { useState, useCallback } from 'react';
import { getRoles } from '../services/roleService';
import { searchCompanies } from '../services/companyService';
import type { RoleDto } from '../services/roleService';
import type { CompanyDto } from '../services/companyService';

interface UseRegisterDataReturn {
  roles: RoleDto[];
  companies: CompanyDto[];
  isLoadingRoles: boolean;
  isLoadingCompanies: boolean;
  error: string | null;
  searchCompanies: (query: string) => Promise<void>;
  refetchRoles: () => Promise<void>;
}

/**
 * Custom hook for RegisterPage that aggregates role and company data
 * Reduces coupling by encapsulating multiple service calls
 */
export const useRegisterData = (): UseRegisterDataReturn => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetchRoles = useCallback(async () => {
    try {
      setIsLoadingRoles(true);
      setError(null);
      const rolesList = await getRoles();
      setRoles(rolesList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load roles';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
    } finally {
      setIsLoadingRoles(false);
    }
  }, []);

  const handleSearchCompanies = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCompanies([]);
      return;
    }

    try {
      setIsLoadingCompanies(true);
      setError(null);
      const companiesList = await searchCompanies(query);
      setCompanies(companiesList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search companies';
      setError(errorMessage);
      console.error('Error searching companies:', err);
    } finally {
      setIsLoadingCompanies(false);
    }
  }, []);

  return {
    roles,
    companies,
    isLoadingRoles,
    isLoadingCompanies,
    error,
    searchCompanies: handleSearchCompanies,
    refetchRoles,
  };
};

