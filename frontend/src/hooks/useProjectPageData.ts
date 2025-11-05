import { useState, useCallback, useEffect } from 'react';
import { getProject } from '../services/projectService';
import type { ProjectDto } from '../services/projectService';

interface UseProjectPageDataOptions {
  projectId: number;
  enabled?: boolean;
}

interface UseProjectPageDataReturn {
  project: ProjectDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for ProjectPage that fetches project data
 * Reduces coupling by encapsulating service call
 */
export const useProjectPageData = (
  options: UseProjectPageDataOptions
): UseProjectPageDataReturn => {
  const { projectId, enabled = true } = options;
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled || !projectId) return;

    try {
      setLoading(true);
      setError(null);
      const projectData = await getProject(projectId);
      setProject(projectData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load project';
      setError(errorMessage);
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, enabled]);

  // Auto-fetch when projectId/enabled change
  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    project,
    loading,
    error,
    refetch,
  };
};

