import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useSidebar } from '../contexts/SidebarContext';
import { useUser } from '../contexts/UserContext';
import { useProjects } from '../contexts/ProjectContext';
import ProjectCreationModal from './ProjectCreationModal';

const getRoleDisplayName = (role: string): string => {
  const roleMap: { [key: string]: string } = {
    'project-manager': 'Project Manager',
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer',
    'fullstack-developer': 'Full Stack Developer',
    'qa-tester': 'QA Tester',
    'devops-engineer': 'DevOps Engineer',
    'ui-ux-designer': 'UI/UX Designer',
    'data-analyst': 'Data Analyst',
    'product-manager': 'Product Manager',
    'scrum-master': 'Scrum Master',
    'technical-lead': 'Technical Lead',
    'other': 'Team Member',
  };
  return roleMap[role] || 'Team Member';
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { hasPermission, currentUser, logout, isProjectManager } = useUser();
  const { projects, loading: projectsLoading } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  const MaterialIcon: React.FC<{ name: string }> = ({ name }) => (
    <span className="material-icons" style={{ fontSize: '20px', color: 'inherit' }}>{name}</span>
  );

  const handleCreateProject = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // Check if user can create projects
  const canCreateProjects = hasPermission('canCreateProjects');
  // Check if user can view projects (either as PM or admin with canViewAllProjects)
  const canViewProjects = isProjectManager() || hasPermission('canViewAllProjects');

  const toggleProject = (projectId: number) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const isProjectExpanded = (projectId: number) => expandedProjects.has(projectId);

  const getCurrentProjectId = () => {
    const match = location.pathname.match(/^\/project\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  useEffect(() => {
    const currentProjectId = getCurrentProjectId();
    if (currentProjectId) {
      setExpandedProjects(prev => {
        if (!prev.has(currentProjectId)) {
          return new Set(prev).add(currentProjectId);
        }
        return prev;
      });
    }
  }, [location.pathname]);

  return (
    <div className={clsx('sidebar', { 'sidebar-collapsed': isCollapsed })} style={{ width: isCollapsed ? '80px' : '280px' }}>
      <button 
        className="sidebar-toggle-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="material-icons" style={{ fontSize: '18px' }}>
          {isCollapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* User Profile */}
      <div className={clsx('sidebar-user-profile', { 'flex-column': isCollapsed })}>
        <div className={clsx('sidebar-avatar', { 'sidebar-avatar-small': isCollapsed })}>
          {currentUser?.avatar || 'U'}
        </div>
        {!isCollapsed && (
          <div>
            <h3 className={clsx('sidebar-user-name')}>
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
            </h3>
            <p className={clsx('sidebar-user-email')}>{currentUser?.email || 'user@example.com'}</p>
            <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: '12px', color: '#64748B' }}>
              <span className="material-icons" style={{ fontSize: '14px', color: '#64748B' }}>business</span>
              <span>{currentUser?.company && currentUser.company.trim() !== '' ? currentUser.company : '-'}</span>
            </div>
            <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: '12px', color: '#64748B' }}>
              <span className="material-icons" style={{ fontSize: '14px', color: '#64748B' }}>badge</span>
              <span>{currentUser?.role ? getRoleDisplayName(currentUser.role) : '-'}</span>
            </div>
            <button 
              className="btn btn-sm w-100 mt-3 d-flex align-items-center justify-content-center gap-2" 
              onClick={logout}
              style={{
                height: '36px',
                borderRadius: '8px',
                background: '#F4F6F8',
                color: '#64748B',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E5E7EB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F4F6F8';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>logout</span>
              Logout
            </button>
          </div>
        )}
        {isCollapsed && (
          <button 
            className="btn btn-sm mt-2" 
            style={{ 
              width: '40px', 
              height: '40px', 
              padding: 0,
              background: '#F4F6F8',
              border: 'none',
              borderRadius: '8px',
              color: '#64748B'
            }} 
            onClick={logout} 
            title="Logout"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E5E7EB';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F4F6F8';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>logout</span>
          </button>
        )}
      </div>

      {/* Menu Section */}
      <div className="sidebar-section">
        <h4 className={clsx('sidebar-section-title', { 'd-none': isCollapsed })}>Menu</h4>
        <Link to="/dashboard" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/dashboard', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="dashboard" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Dashboard</span>
        </Link>
        <Link to="/inbox" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/inbox', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="inbox" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Inbox</span>
        </Link>
        <Link to="/calendar" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/calendar', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="event" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Calendar</span>
        </Link>
      </div>

      {/* Team Spaces Section */}
      <div className="sidebar-section">
        <div className={clsx('sidebar-section-title', 'd-flex justify-content-between align-items-center', { 'd-none': isCollapsed })}>
          <span>Team spaces</span>
          {canCreateProjects && (
            <button
              className="sidebar-add-btn"
              onClick={() => setShowCreateModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F1F5F9';
                e.currentTarget.style.color = '#334155';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = '#64748B';
              }}
              title="Create Project"
            >
              +
            </button>
          )}
        </div>

        {/* Projects List */}
        {!isCollapsed && canViewProjects && (
          <div style={{ marginBottom: '12px' }}>
            {projectsLoading ? (
              <div className="text-center py-2" style={{ fontSize: '12px', color: '#64748B' }}>
                Loading projects...
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => {
                const isActive = location.pathname.startsWith(`/project/${project.id}`);
                const isExpanded = isProjectExpanded(project.id);
                return (
                  <div key={project.id} style={{ marginBottom: '4px' }}>
                    {/* Project Header - Clickable to expand/collapse */}
                    <div
                      className={clsx('sidebar-menu-item', {
                        'active': isActive,
                        'd-flex align-items-center gap-2': true
                      })}
                      onClick={() => toggleProject(project.id)}
                      style={{
                        paddingLeft: '12px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      <span 
                        className="material-icons" 
                        style={{ 
                          fontSize: '16px', 
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                        }}
                      >
                        chevron_right
                      </span>
                      <MaterialIcon name="folder" />
                      <span className="sidebar-menu-text" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {project.name}
                      </span>
                    </div>
                    
                    {/* Project Sub-items - Shown when expanded */}
                    {isExpanded && (
                      <div style={{ paddingLeft: '32px', marginTop: '4px' }}>
                        <Link
                          to={`/project/${project.id}/tasks`}
                          className={clsx('sidebar-menu-item', {
                            'active': location.pathname === `/project/${project.id}/tasks`,
                            'd-flex align-items-center gap-2': true
                          })}
                          style={{
                            paddingLeft: '12px',
                            fontSize: '13px',
                            marginBottom: '2px',
                            color: location.pathname === `/project/${project.id}/tasks` ? '#0056D2' : '#64748B'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MaterialIcon name="task_alt" />
                          <span className="sidebar-menu-text">Tasks</span>
                        </Link>
                        {hasPermission('canViewProjectOverview') && (
                          <Link
                            to={`/project/${project.id}/backlog`}
                            className={clsx('sidebar-menu-item', {
                              'active': location.pathname === `/project/${project.id}/backlog`,
                              'd-flex align-items-center gap-2': true
                            })}
                            style={{
                              paddingLeft: '12px',
                              fontSize: '13px',
                              marginBottom: '2px',
                              color: location.pathname === `/project/${project.id}/backlog` ? '#0056D2' : '#64748B'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MaterialIcon name="inventory" />
                            <span className="sidebar-menu-text">Backlog</span>
                          </Link>
                        )}
                        <Link
                          to={`/project/${project.id}/docs`}
                          className={clsx('sidebar-menu-item', {
                            'active': location.pathname === `/project/${project.id}/docs`,
                            'd-flex align-items-center gap-2': true
                          })}
                          style={{
                            paddingLeft: '12px',
                            fontSize: '13px',
                            marginBottom: '2px',
                            color: location.pathname === `/project/${project.id}/docs` ? '#0056D2' : '#64748B'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MaterialIcon name="description" />
                          <span className="sidebar-menu-text">Docs</span>
                        </Link>
                        <Link
                          to={`/project/${project.id}/meeting`}
                          className={clsx('sidebar-menu-item', {
                            'active': location.pathname === `/project/${project.id}/meeting`,
                            'd-flex align-items-center gap-2': true
                          })}
                          style={{
                            paddingLeft: '12px',
                            fontSize: '13px',
                            marginBottom: '2px',
                            color: location.pathname === `/project/${project.id}/meeting` ? '#0056D2' : '#64748B'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MaterialIcon name="groups" />
                          <span className="sidebar-menu-text">Meeting</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-2" style={{ fontSize: '12px', color: '#94A3B8' }}>
                No projects yet
              </div>
            )}
          </div>
        )}

        {/* Collapsed Projects Icon */}
        {isCollapsed && canViewProjects && projects.length > 0 && (
          <div className="position-relative">
            <div className="sidebar-menu-item justify-content-center" style={{ position: 'relative' }}>
              <MaterialIcon name="folder" />
              {projects.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '10px', padding: '2px 5px' }}
                >
                  {projects.length}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreateProject}
      />

      {/* Other Section */}
      <div className="sidebar-section">
        <h4 className={clsx('sidebar-section-title', { 'd-none': isCollapsed })}>Other</h4>
        {hasPermission('canManagePermissions') && (
          <Link to="/permissions" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/permissions', 'justify-content-center': isCollapsed })}>
            <MaterialIcon name="admin_panel_settings" />
            <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Permissions</span>
          </Link>
        )}
        <Link to="/settings" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/settings', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="settings" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Settings</span>
        </Link>
        <Link to="/support" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/support', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="help" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Support</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
