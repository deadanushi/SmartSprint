import React from 'react';
import type { StepComponentProps } from '../types';
import type { RoleDto } from '../../../services/api';

interface Step3RoleSelectionProps extends StepComponentProps {
  roles: RoleDto[];
  isLoadingRoles: boolean;
}

const Step3RoleSelection: React.FC<Step3RoleSelectionProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  showError,
  roles,
  isLoadingRoles,
}) => {
  const getRoleIcon = (roleKey: string): string => {
    const iconMap: { [key: string]: string } = {
      'admin': 'admin_panel_settings',
      'project-manager': 'supervisor_account',
      'frontend-developer': 'code',
      'backend-developer': 'storage',
      'fullstack-developer': 'developer_mode',
      'qa-tester': 'bug_report',
      'devops-engineer': 'cloud',
      'ui-ux-designer': 'palette',
      'data-analyst': 'analytics',
      'product-manager': 'inventory',
      'scrum-master': 'group_work',
      'technical-lead': 'engineering',
      'other': 'person',
    };
    return iconMap[roleKey] || 'person';
  };

  const getRoleDescription = (roleKey: string): string => {
    const descriptions: { [key: string]: string } = {
      'admin': 'Full system access and management capabilities',
      'project-manager': 'Can create projects & sprints, manage teams',
      'frontend-developer': 'Focus on UI/UX development tasks',
      'backend-developer': 'Focus on API and server-side development',
      'fullstack-developer': 'Handles both frontend and backend tasks',
      'qa-tester': 'Quality assurance and testing responsibilities',
      'devops-engineer': 'Infrastructure and deployment management',
      'ui-ux-designer': 'Design and user experience work',
      'data-analyst': 'Data analysis and reporting',
      'product-manager': 'Product planning and strategy',
      'scrum-master': 'Agile process facilitation',
      'technical-lead': 'Technical oversight and mentorship',
      'other': 'General team member',
    };
    return descriptions[roleKey] || 'Team member role';
  };

  const handleContinue = () => {
    if (!formData.role) {
      showError('Select a role', 'Please choose your primary role to continue.', 'info');
      return;
    }
    onNext();
  };

  return (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Select Your Role</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Choose your primary role in the team</p>
      
      {isLoadingRoles ? (
        <div className="text-center py-5">
          <div className="spinner-border mb-3" style={{ color: '#0056D2' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0" style={{ color: '#6B7280' }}>Loading roles...</p>
        </div>
      ) : (
        <div className="role-grid row g-3 mb-4">
          {roles.map(role => (
            <div
              key={role.id}
              className="col-6 col-md-4"
            >
              <div
                className="role-card border rounded p-3 cursor-pointer h-100"
                onClick={() => onInputChange('role', role.role_key)}
                style={{ 
                  background: formData.role === role.role_key ? '#EBF5FF' : '#FAFBFC',
                  borderColor: formData.role === role.role_key ? '#0056D2' : '#E5E7EB',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="text-center mb-2">
                  <span className="material-icons" style={{ 
                    fontSize: '28px',
                    color: formData.role === role.role_key ? '#0056D2' : '#6B7280'
                  }}>
                    {getRoleIcon(role.role_key)}
                  </span>
                </div>
                <div className="small fw-bold text-center mb-1" style={{ 
                  color: formData.role === role.role_key ? '#0056D2' : '#374151',
                  fontSize: '14px'
                }}>
                  {role.name}
                </div>
                <div className="small text-center" style={{ 
                  color: formData.role === role.role_key ? '#0056D2' : '#6B7280',
                  fontSize: '11px',
                  lineHeight: '1.3'
                }}>
                  {getRoleDescription(role.role_key)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="btn flex-fill"
            style={{ 
              height: '46px',
              borderRadius: '8px',
              background: '#F3F4F6',
              color: '#374151',
              fontSize: '15px',
              border: '1px solid #E5E7EB',
              padding: '14px'
            }}
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleContinue}
          className="btn flex-fill fw-bold"
          disabled={!formData.role}
          style={{ 
            height: '46px',
            borderRadius: '8px',
            background: formData.role ? '#0056D2' : '#9CA3AF',
            color: 'white',
            fontSize: '15px',
            border: 'none',
            padding: '14px',
            cursor: formData.role ? 'pointer' : 'not-allowed'
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default Step3RoleSelection;

