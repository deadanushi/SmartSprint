import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';
import { useUser } from '../contexts/UserContext';

// Helper function to convert role code to display name
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

  const sidebarStyles: React.CSSProperties = {
    width: isCollapsed ? '80px' : '280px',
    height: '100vh',
    background: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    padding: isCollapsed ? '24px 0' : '24px 0',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
    transition: 'width 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const toggleButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    right: '-12px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#6B7280',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
  };

  const userProfileStyles: React.CSSProperties = {
    padding: isCollapsed ? '0 20px 32px 20px' : '0 24px 32px 24px',
    borderBottom: '1px solid #F3F4F6',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: isCollapsed ? 'column' : 'row',
    alignItems: 'center',
    gap: isCollapsed ? '0' : '12px',
  };

  const avatarStyles: React.CSSProperties = {
    width: isCollapsed ? '32px' : '40px',
    height: isCollapsed ? '32px' : '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: isCollapsed ? '14px' : '16px',
    fontWeight: '600',
    marginBottom: isCollapsed ? '8px' : '0',
  };

  const userNameStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0',
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };

  const userEmailStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6B7280',
    margin: '0',
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: '24px',
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 12px 0',
    padding: isCollapsed ? '0 20px' : '0 24px',
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };

  const menuItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isCollapsed ? '0' : '12px',
    padding: isCollapsed ? '12px 20px' : '12px 24px',
    fontSize: '14px',
    color: '#6B7280',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    position: 'relative',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
  };

  const activeMenuItemStyles: React.CSSProperties = {
    ...menuItemStyles,
    background: '#EFF6FF',
    color: '#2563EB',
    borderRight: '3px solid #2563EB',
  };

  const iconStyles: React.CSSProperties = {
    fontSize: '20px',
    width: '20px',
    textAlign: 'center',
    transition: 'color 0.2s ease',
  };

  const menuTextStyles: React.CSSProperties = {
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease',
    whiteSpace: 'nowrap',
  };

  const teamSpacesStyles: React.CSSProperties = {
    ...sectionTitleStyles,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const addButtonStyles: React.CSSProperties = {
    fontSize: '16px',
    color: '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: isCollapsed ? 0 : 1,
  };

  const getMenuItemStyle = (path: string) => {
    return location.pathname === path ? activeMenuItemStyles : menuItemStyles;
  };

  const MaterialIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => (
    <span className={`material-icons ${className || ''}`} style={{ fontSize: '20px' }}>
      {name}
    </span>
  );

  return (
    <div style={sidebarStyles}>
      <button 
        style={toggleButtonStyles}
        onClick={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F9FAFB';
          e.currentTarget.style.borderColor = '#D1D5DB';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#FFFFFF';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* User Profile */}
      <div style={userProfileStyles}>
        <div style={avatarStyles}>{currentUser?.avatar || 'U'}</div>
        {!isCollapsed && (
          <div>
            <h3 style={userNameStyles}>
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
            </h3>
            <p style={userEmailStyles}>{currentUser?.email || 'user@example.com'}</p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
              fontSize: '12px',
              color: '#6B7280',
            }}>
              <span className="material-icons" style={{ fontSize: '14px' }}>business</span>
              <span>{currentUser?.company || 'Company'}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '2px',
              fontSize: '12px',
              color: '#6B7280',
            }}>
              <span className="material-icons" style={{ fontSize: '14px' }}>badge</span>
              <span>{getRoleDisplayName(currentUser?.role || 'other')}</span>
            </div>
            <button
              style={{
                background: '#F3F4F6',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#6B7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                transition: 'all 0.2s ease',
                width: '100%',
                justifyContent: 'center',
              }}
              onClick={() => {
                logout();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E5E7EB';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>logout</span>
              Logout
            </button>
          </div>
        )}
        {isCollapsed && (
          <button
            style={{
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '8px',
              transition: 'all 0.2s ease',
            }}
            onClick={() => {
              logout();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E5E7EB';
              e.currentTarget.style.borderColor = '#9CA3AF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            title="Logout"
          >
            <span className="material-icons" style={{ fontSize: '16px', color: '#6B7280' }}>logout</span>
          </button>
        )}
      </div>

      {/* Menu Section */}
      <div style={sectionStyles}>
        <h4 style={sectionTitleStyles}>Menu</h4>
        <Link to="/dashboard" style={getMenuItemStyle('/dashboard')}>
          <MaterialIcon name="dashboard" />
          <span style={menuTextStyles}>Dashboard</span>
        </Link>
        <Link to="/inbox" style={getMenuItemStyle('/inbox')}>
          <MaterialIcon name="inbox" />
          <span style={menuTextStyles}>Inbox</span>
        </Link>
        <Link to="/calendar" style={getMenuItemStyle('/calendar')}>
          <MaterialIcon name="event" />
          <span style={menuTextStyles}>Calendar</span>
        </Link>
      </div>

      {/* Team Spaces Section */}
      <div style={sectionStyles}>
        <div style={teamSpacesStyles}>
          <span>Team spaces</span>
          <span style={addButtonStyles}>+</span>
        </div>
            <Link to="/tasks" style={getMenuItemStyle('/tasks')}>
              <MaterialIcon name="task_alt" />
              <span style={menuTextStyles}>Tasks</span>
            </Link>
            {hasPermission('canViewProjectOverview') && (
              <Link to="/backlog" style={getMenuItemStyle('/backlog')}>
                <MaterialIcon name="inventory" />
                <span style={menuTextStyles}>Backlog</span>
              </Link>
            )}
            <Link to="/docs" style={getMenuItemStyle('/docs')}>
              <MaterialIcon name="description" />
              <span style={menuTextStyles}>Docs</span>
            </Link>
        <Link to="/meeting" style={getMenuItemStyle('/meeting')}>
          <MaterialIcon name="groups" />
          <span style={menuTextStyles}>Meeting</span>
        </Link>
      </div>

      {/* Other Section */}
      <div style={sectionStyles}>
        <h4 style={sectionTitleStyles}>Other</h4>
        {hasPermission('canManagePermissions') && (
          <Link to="/permissions" style={getMenuItemStyle('/permissions')}>
            <MaterialIcon name="admin_panel_settings" />
            <span style={menuTextStyles}>Permissions</span>
          </Link>
        )}
        <Link to="/settings" style={getMenuItemStyle('/settings')}>
          <MaterialIcon name="settings" />
          <span style={menuTextStyles}>Settings</span>
        </Link>
        <Link to="/support" style={getMenuItemStyle('/support')}>
          <MaterialIcon name="help" />
          <span style={menuTextStyles}>Support</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;