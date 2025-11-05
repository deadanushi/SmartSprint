import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ProjectDto } from '../services/projectService';
import { useProjects as useProjectsHook } from '../hooks/useProjects';
import { useUser } from './UserContext';

interface ProjectContextType {
  projects: ProjectDto[];
  currentProject: ProjectDto | null;
  setCurrentProject: (project: ProjectDto | null) => void;
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<ProjectDto>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

/**
 * ProjectProvider with improved dependency injection
 * Uses useProjects hook instead of direct service calls
 * Injects user data from UserContext as parameters (dependency injection pattern)
 */
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { currentUser } = useUser();
  const [currentProject, setCurrentProject] = useState<ProjectDto | null>(null);
  
  // Use the hook with dependency injection - pass user data as parameters
  // This breaks the tight coupling while maintaining the same API
  const {
    projects,
    loading,
    error,
    refreshProjects,
    createProject
  } = useProjectsHook({
    userId: currentUser?.id,
    userRole: currentUser?.role,
    enabled: !!currentUser
  });

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        loading,
        error,
        refreshProjects,
        createProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

