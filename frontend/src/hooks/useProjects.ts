import { useState, useCallback, useEffect } from 'react';
import { getProjects, createProject as apiCreateProject } from '../services/projectService';
import type { ProjectDto } from '../services/projectService';

interface UseProjectsOptions {
  userId?: string | number | null;
  userRole?: string;
  enabled?: boolean;
}

interface UseProjectsReturn {
  projects: ProjectDto[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<ProjectDto>;
}

/**
 * Custom hook for project operations
 * Uses dependency injection instead of context dependency
 * @param options - Configuration options including userId and userRole
 */
export const useProjects = (options: UseProjectsOptions = {}): UseProjectsReturn => {
  const { userId, userRole, enabled = true } = options;
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      
      const isAdmin = userRole === 'admin';
      const projectManagerId = isAdmin 
        ? undefined 
        : (userId ? (typeof userId === 'string' ? parseInt(userId, 10) : userId) : undefined);
      
      const fetchedProjects = await getProjects({
        project_manager_id: projectManagerId,
        limit: 100
      });
      setProjects(fetchedProjects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, userRole, enabled]);

  useEffect(() => {
    if (enabled && userId) {
      refreshProjects();
    }
  }, [enabled, userId, refreshProjects]);

  const createProject = useCallback(async (name: string, description?: string): Promise<ProjectDto> => {
    try {
      setError(null);
      const projectManagerId = userId 
        ? (typeof userId === 'string' ? parseInt(userId, 10) : userId) 
        : null;
      const newProject = await apiCreateProject({
        name,
        description: description || null,
        project_manager_id: projectManagerId,
        status_key: 'planning'
      });
      await refreshProjects();
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    }
  }, [userId, refreshProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    createProject,
  };
};

