import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { User, UserRole, ROLE_PERMISSIONS, getPermissionsForRole } from '../types/permissions';

const PermissionsManagementPage: React.FC = () => {
  const { currentUser, hasPermission } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('frontend-developer');
  const [customPermissions, setCustomPermissions] = useState<Partial<User['permissions']>>({});

  // Mock users data - replace with actual API call
  const mockUsers: User[] = [
    {
      id: '1',
      firstName: 'Davis',
      lastName: 'Donin',
      email: 'daviddoni@gmail.com',
      role: 'project-manager',
      company: 'Google',
      permissions: getPermissionsForRole('project-manager'),
      avatar: 'DD',
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15',
    },
    {
      id: '2',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      role: 'frontend-developer',
      company: 'Google',
      permissions: getPermissionsForRole('frontend-developer'),
      avatar: 'JD',
      isActive: true,
      createdAt: '2024-01-02',
      lastLogin: '2024-01-14',
    },
    {
      id: '3',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@gmail.com',
      role: 'backend-developer',
      company: 'Google',
      permissions: getPermissionsForRole('backend-developer'),
      avatar: 'JS',
      isActive: true,
      createdAt: '2024-01-03',
      lastLogin: '2024-01-13',
    },
  ];

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'project-manager', label: 'Project Manager' },
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Full Stack Developer' },
    { value: 'qa-tester', label: 'QA Tester' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
    { value: 'data-analyst', label: 'Data Analyst' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'scrum-master', label: 'Scrum Master' },
    { value: 'technical-lead', label: 'Technical Lead' },
    { value: 'other', label: 'Other' },
  ];

  const permissionCategories = [
    {
      title: 'Task Management',
      permissions: [
        'canCreateTasks',
        'canAssignTasks',
        'canEditTasks',
        'canDeleteTasks',
        'canChangeDeadlines',
        'canChangePriority',
        'canChangeStatus',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Task Visibility',
      permissions: [
        'canSeeAllTasks',
        'canSeeFETasks',
        'canSeeBETasks',
        'canSeeDesignTasks',
        'canSeeTestTasks',
        'canSeeDevOpsTasks',
        'canSeeDataTasks',
        'canSeeProductTasks',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Team Management',
      permissions: [
        'canAddTeamMembers',
        'canRemoveTeamMembers',
        'canChangeUserRoles',
        'canViewAllTeamMembers',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Project Management',
      permissions: [
        'canViewProjectOverview',
        'canEditProjectSettings',
        'canCreateSprints',
        'canManageSprints',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Documentation',
      permissions: [
        'canUploadDocuments',
        'canDeleteDocuments',
        'canViewAllDocuments',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Meetings',
      permissions: [
        'canCreateMeetings',
        'canEditMeetings',
        'canDeleteMeetings',
        'canViewAllMeetings',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Analytics & Reporting',
      permissions: [
        'canViewAllMetrics',
        'canGenerateReports',
        'canExportData',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Comments & Communication',
      permissions: [
        'canAddComments',
        'canEditComments',
        'canDeleteComments',
        'canViewAllComments',
      ] as (keyof User['permissions'])[],
    },
    {
      title: 'Special Permissions',
      permissions: [
        'canManagePermissions',
        'canAccessAdminPanel',
        'canViewUserActivity',
      ] as (keyof User['permissions'])[],
    },
  ];

  const pageStyles: React.CSSProperties = {
    marginLeft: '280px',
    minHeight: '100vh',
    background: '#F4F6F8',
    padding: '32px',
  };

  const headerStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '16px',
    color: '#6B7280',
    margin: '0',
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    gap: '24px',
  };

  const leftPanelStyles: React.CSSProperties = {
    flex: '0 0 300px',
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    height: 'fit-content',
  };

  const rightPanelStyles: React.CSSProperties = {
    flex: 1,
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const userListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const userItemStyles: React.CSSProperties = {
    padding: '16px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const selectedUserItemStyles: React.CSSProperties = {
    ...userItemStyles,
    borderColor: '#2563EB',
    background: '#EFF6FF',
  };

  const userAvatarStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#2563EB',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const userNameStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0',
  };

  const userRoleStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0',
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px 0',
  };

  const roleSelectStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px',
    background: '#FFFFFF',
  };

  const categoryStyles: React.CSSProperties = {
    marginBottom: '32px',
  };

  const categoryTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px 0',
    paddingBottom: '8px',
    borderBottom: '1px solid #E5E7EB',
  };

  const permissionGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  };

  const permissionItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#F9FAFB',
    borderRadius: '6px',
    fontSize: '14px',
  };

  const checkboxStyles: React.CSSProperties = {
    width: '16px',
    height: '16px',
    accentColor: '#2563EB',
  };

  const buttonStyles: React.CSSProperties = {
    background: '#2563EB',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '24px',
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setCustomPermissions({});
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setCustomPermissions({});
  };

  const handlePermissionChange = (permission: keyof User['permissions'], value: boolean) => {
    setCustomPermissions(prev => ({
      ...prev,
      [permission]: value,
    }));
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;
    
    // TODO: Implement API call to save permissions
    console.log('Saving permissions for user:', selectedUser.id);
    console.log('Role:', selectedRole);
    console.log('Custom permissions:', customPermissions);
    
    // Show success message
    alert('Permissions updated successfully!');
  };

  const getPermissionValue = (permission: keyof User['permissions']): boolean => {
    if (customPermissions.hasOwnProperty(permission)) {
      return customPermissions[permission] as boolean;
    }
    return ROLE_PERMISSIONS[selectedRole][permission];
  };

  const getPermissionLabel = (permission: string): string => {
    return permission
      .replace('can', '')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());
  };

  // Check if user has permission to access this page
  if (!hasPermission('canManagePermissions')) {
    return (
      <div style={pageStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>Access Denied</h1>
          <p style={subtitleStyles}>You don't have permission to manage user permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Permissions Management</h1>
        <p style={subtitleStyles}>Manage user roles and permissions for your team</p>
      </div>

      <div style={contentStyles}>
        <div style={leftPanelStyles}>
          <h3 style={sectionTitleStyles}>Team Members</h3>
          <div style={userListStyles}>
            {mockUsers.map(user => (
              <div
                key={user.id}
                style={selectedUser?.id === user.id ? selectedUserItemStyles : userItemStyles}
                onClick={() => handleUserSelect(user)}
                onMouseEnter={(e) => {
                  if (selectedUser?.id !== user.id) {
                    e.currentTarget.style.borderColor = '#9CA3AF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedUser?.id !== user.id) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }
                }}
              >
                <div style={userAvatarStyles}>{user.avatar}</div>
                <div style={userNameStyles}>{user.firstName} {user.lastName}</div>
                <div style={userRoleStyles}>
                  {roleOptions.find(r => r.value === user.role)?.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={rightPanelStyles}>
          {selectedUser ? (
            <>
              <h3 style={sectionTitleStyles}>
                Permissions for {selectedUser.firstName} {selectedUser.lastName}
              </h3>
              
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                style={roleSelectStyles}
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {permissionCategories.map(category => (
                <div key={category.title} style={categoryStyles}>
                  <h4 style={categoryTitleStyles}>{category.title}</h4>
                  <div style={permissionGridStyles}>
                    {category.permissions.map(permission => (
                      <div key={permission} style={permissionItemStyles}>
                        <input
                          type="checkbox"
                          checked={getPermissionValue(permission)}
                          onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                          style={checkboxStyles}
                        />
                        <span>{getPermissionLabel(permission)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                style={buttonStyles}
                onClick={handleSavePermissions}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1D4ED8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2563EB';
                }}
              >
                Save Permissions
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              <span className="material-icons" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>
                person
              </span>
              <p>Select a team member to manage their permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsManagementPage;

