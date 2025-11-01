import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSidebar } from '../contexts/SidebarContext';
import { useUser } from '../contexts/UserContext';

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
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const { hasPermission, currentUser, logout } = useUser();

  const MaterialIcon: React.FC<{ name: string }> = ({ name }) => (
    <span className="material-icons" style={{ fontSize: '20px', color: 'inherit' }}>{name}</span>
  );

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
          <span className="sidebar-add-btn">+</span>
        </div>
        <Link to="/tasks" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/tasks', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="task_alt" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Tasks</span>
        </Link>
        {hasPermission('canViewProjectOverview') && (
          <Link to="/backlog" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/backlog', 'justify-content-center': isCollapsed })}>
            <MaterialIcon name="inventory" />
            <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Backlog</span>
          </Link>
        )}
        <Link to="/docs" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/docs', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="description" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Docs</span>
        </Link>
        <Link to="/meeting" className={clsx('sidebar-menu-item', { 'active': location.pathname === '/meeting', 'justify-content-center': isCollapsed })}>
          <MaterialIcon name="groups" />
          <span className={clsx('sidebar-menu-text', { 'd-none': isCollapsed })}>Meeting</span>
        </Link>
      </div>

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
