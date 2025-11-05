import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext';
import { useProjectPageData } from '../hooks/useProjectPageData';
import TasksPage from './TasksPage';
import BacklogPage from './BacklogPage';
import OverviewTab from './OverviewTab';
import DocsTab from './DocsTab';
import MeetingTab from './MeetingTab';

interface ProjectPageProps {
  defaultTab?: 'overview' | 'tasks' | 'backlog' | 'docs' | 'meeting';
}

const ProjectPage: React.FC<ProjectPageProps> = ({ defaultTab }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshProjects } = useProjects();
  
  // Use custom hook to fetch project data
  const { project, loading, refetch: refetchProject } = useProjectPageData({
    projectId: projectId ? parseInt(projectId) : 0,
    enabled: !!projectId,
  });

  // Determine active tab from URL
  const getActiveTabFromUrl = (): 'overview' | 'tasks' | 'backlog' | 'docs' | 'meeting' => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('/tasks')) return 'tasks';
    if (location.pathname.includes('/backlog')) return 'backlog';
    if (location.pathname.includes('/docs')) return 'docs';
    if (location.pathname.includes('/meeting')) return 'meeting';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'backlog' | 'docs' | 'meeting'>(getActiveTabFromUrl());

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromUrl = defaultTab || (location.pathname.includes('/tasks') ? 'tasks' :
      location.pathname.includes('/backlog') ? 'backlog' :
      location.pathname.includes('/docs') ? 'docs' :
      location.pathname.includes('/meeting') ? 'meeting' : 'overview');
    setActiveTab(tabFromUrl);
  }, [location.pathname, defaultTab]);

  // Refresh projects context when project is loaded
  useEffect(() => {
    if (project) {
      refreshProjects();
    }
  }, [project, refreshProjects]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-secondary">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <h3 className="text-danger mb-2">Project Not Found</h3>
          <p className="text-secondary">The project you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'task_alt' },
    { id: 'backlog', label: 'Backlog', icon: 'inventory' },
    { id: 'docs', label: 'Documents', icon: 'description' },
    { id: 'meeting', label: 'Meeting', icon: 'groups' },
  ];

  const handleTabChange = (tabId: 'overview' | 'tasks' | 'backlog' | 'docs' | 'meeting') => {
    setActiveTab(tabId);
    if (tabId === 'overview') {
      navigate(`/project/${projectId}`);
    } else {
      navigate(`/project/${projectId}/${tabId}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px 40px' }}>
      {/* Project Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-2" style={{ fontSize: '28px', color: '#0F172A' }}>{project.name}</h1>
        {project.description && (
          <p className="text-secondary mb-3" style={{ fontSize: '15px' }}>{project.description}</p>
        )}
        <div className="d-flex gap-4 align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="material-icons" style={{ fontSize: '18px', color: '#64748B' }}>folder</span>
            <span style={{ fontSize: '14px', color: '#64748B' }}>
              {project.tasks_count} Tasks
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="material-icons" style={{ fontSize: '18px', color: '#64748B' }}>people</span>
            <span style={{ fontSize: '14px', color: '#64748B' }}>
              {project.members_count} Members
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="material-icons" style={{ fontSize: '18px', color: '#64748B' }}>schedule</span>
            <span style={{ fontSize: '14px', color: '#64748B' }}>
              {project.sprints_count} Sprints
            </span>
          </div>
          {project.status_name && (
            <div className="d-flex align-items-center gap-2">
              <span
                className="badge rounded-pill px-3 py-1"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: project.status_key === 'active' ? '#ECFDF5' : '#F1F5F9',
                  color: project.status_key === 'active' ? '#10B981' : '#64748B'
                }}
              >
                {project.status_name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-bottom mb-4">
        <div className="d-flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`btn border-0 rounded-0 pb-3 px-3 ${
                activeTab === tab.id ? 'border-bottom border-3 border-primary' : ''
              }`}
              style={{
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? '#3B82F6' : '#64748B',
                background: 'transparent'
              }}
            >
              <span className="material-icons me-2" style={{ fontSize: '18px', verticalAlign: 'middle' }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && <OverviewTab project={project} />}

        {activeTab === 'tasks' && (
          <div style={{ marginTop: '-24px', marginLeft: '-40px', marginRight: '-40px' }}>
            <TasksPage />
          </div>
        )}

        {activeTab === 'backlog' && (
          <div style={{ marginTop: '-24px', marginLeft: '-40px', marginRight: '-40px' }}>
            <BacklogPage />
          </div>
        )}

        {activeTab === 'docs' && projectId && <DocsTab projectId={parseInt(projectId)} />}

        {activeTab === 'meeting' && <MeetingTab />}
      </div>
    </div>
  );
};

export default ProjectPage;

