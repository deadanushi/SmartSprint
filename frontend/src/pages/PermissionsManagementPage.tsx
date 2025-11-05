import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useUser } from '../contexts/UserContext';
import AlertModal from '../components/AlertModal';
import { usePermissionsManagement } from '../hooks/usePermissionsManagement';
import type { RoleDto } from '../services/roleService';

const PermissionsManagementPage: React.FC = () => {
  const { hasPermission } = useUser();
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Use custom hook to aggregate permissions management data
  const {
    roles,
    allPermissions,
    selectedRole,
    rolePermissions,
    selectedPermissionIds,
    isLoading,
    isSaving,
    error,
    setSelectedPermissionIds,
    loadRolePermissions,
    saveRolePermissions,
    refetchRoles,
    refetchPermissions,
    clearError,
  } = usePermissionsManagement();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([refetchRoles(), refetchPermissions()]);
      
      // Auto-select first role if available
      if (roles.length > 0) {
        await loadRolePermissions(roles[0]);
      }
    };
    
    loadData();
  }, []); // Only run once on mount

  // Auto-select first role when roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      loadRolePermissions(roles[0]);
    }
  }, [roles.length, selectedRole, loadRolePermissions]);

  const handleRoleSelect = async (role: RoleDto) => {
    await loadRolePermissions(role);
  };

  const handlePermissionToggle = (permissionId: number) => {
    const newSelected = new Set(selectedPermissionIds);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissionIds(newSelected);
  };

  const handleSavePermissions = async () => {
    try {
      await saveRolePermissions();
      // Show success modal
      setSuccessModalOpen(true);
    } catch (err) {
      // Error is already handled by the hook
      console.error('Error saving permissions:', err);
    }
  };

  // Get permission categories from allPermissions
  const permissionCategories = React.useMemo(() => {
    const categoryMap = new Map<string, typeof allPermissions[number][]>();
    
    allPermissions.forEach(perm => {
      if (!categoryMap.has(perm.category)) {
        categoryMap.set(perm.category, []);
      }
      categoryMap.get(perm.category)!.push(perm);
    });
    
    return Array.from(categoryMap.entries()).map(([category, perms]) => ({
      title: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' '),
      permissions: perms,
    }));
  }, [allPermissions]);

  if (!hasPermission('canManagePermissions')) {
    return (
      <div className="page-container" style={{ padding: '40px' }}>
        <div className="bg-white rounded-lg p-5" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="material-icons" style={{ fontSize: '24px', color: '#DC2626' }}>block</span>
            <h1 className="h4 fw-bold mb-0" style={{ color: '#111827' }}>Access Denied</h1>
          </div>
          <p className="mb-0" style={{ color: '#6B7280', fontSize: '14px' }}>
            You don't have permission to manage role permissions.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-container" style={{ padding: '40px' }}>
        <div className="bg-white rounded-lg p-5 text-center" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div className="spinner-border mb-3" style={{ color: '#0056D2', width: '40px', height: '40px' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0" style={{ color: '#6B7280', fontSize: '14px' }}>Loading roles and permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '40px', background: '#F9FAFB' }}>
      {/* Header */}
      <div className="mb-5">
        <div className="d-flex align-items-center gap-3 mb-2">
          <span className="material-icons" style={{ fontSize: '28px', color: '#0056D2' }}>admin_panel_settings</span>
          <h1 className="h3 fw-bold mb-0" style={{ color: '#111827' }}>Role Permissions</h1>
        </div>
        <p className="mb-0" style={{ color: '#6B7280', fontSize: '14px', marginLeft: '44px' }}>
          Configure permissions for each role. Users automatically inherit permissions from their assigned role.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 border-0 rounded-lg" 
             style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '14px', padding: '14px 16px' }} 
             role="alert">
          <span className="material-icons" style={{ fontSize: '20px' }}>error</span>
          <span className="flex-grow-1">{error}</span>
          <button
            type="button"
            className="btn-close"
            onClick={clearError}
            aria-label="Close"
            style={{ fontSize: '12px' }}
          ></button>
        </div>
      )}

      <div className="d-flex gap-4">
        {/* Left Panel - Roles */}
        <div className="bg-white rounded-lg shadow-sm" style={{ 
          flex: '0 0 320px', 
          height: 'fit-content', 
          maxHeight: 'calc(100vh - 220px)', 
          overflowY: 'auto',
          border: '1px solid #E5E7EB'
        }}>
          <div className="p-4 border-bottom" style={{ borderColor: '#F3F4F6' }}>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="material-icons" style={{ fontSize: '18px', color: '#64748B' }}>badge</span>
              <h3 className="h6 fw-semibold mb-0" style={{ color: '#111827', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Available Roles
              </h3>
            </div>
            <p className="mb-0 small" style={{ color: '#94A3B8', fontSize: '12px' }}>
              {roles.length} role{roles.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="p-3">
            {roles.length === 0 ? (
              <div className="text-center py-4">
                <p className="mb-0" style={{ color: '#94A3B8', fontSize: '13px' }}>No roles found</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {roles.map(role => {
                  const isSelected = selectedRole?.id === role.id;
                  const permissionCount = rolePermissions && isSelected ? rolePermissions.permissions.length : 0;
                  
                  return (
                    <div
                      key={role.id}
                      className={clsx('role-card rounded-lg p-3 cursor-pointer transition', {
                        'selected': isSelected
                      })}
                      onClick={() => handleRoleSelect(role)}
                      style={{
                        border: isSelected ? '2px solid #0056D2' : '1px solid #E5E7EB',
                        background: isSelected ? '#EBF5FF' : '#FFFFFF',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = '#F9FAFB';
                          e.currentTarget.style.borderColor = '#D1D5DB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                        }
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <div className="fw-semibold mb-1" style={{ 
                            color: isSelected ? '#0056D2' : '#111827', 
                            fontSize: '14px',
                            fontWeight: 600
                          }}>
                            {role.name}
                          </div>
                          <div className="small" style={{ 
                            color: isSelected ? '#64748B' : '#94A3B8', 
                            fontSize: '12px',
                            fontFamily: 'monospace'
                          }}>
                            {role.role_key}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-icons" style={{ 
                            fontSize: '18px', 
                            color: '#0056D2' 
                          }}>check_circle</span>
                        )}
                      </div>
                      {isSelected && permissionCount > 0 && (
                        <div className="d-flex align-items-center gap-1 mt-2">
                          <span className="material-icons" style={{ fontSize: '14px', color: '#64748B' }}>verified</span>
                          <span className="small" style={{ color: '#64748B', fontSize: '12px' }}>
                            {permissionCount} permission{permissionCount !== 1 ? 's' : ''} enabled
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Permissions */}
        <div className="bg-white rounded-lg shadow-sm flex-grow-1" style={{ 
          maxHeight: 'calc(100vh - 220px)', 
          overflowY: 'auto',
          border: '1px solid #E5E7EB'
        }}>
          {selectedRole ? (
            <>
              {/* Header with Save Button */}
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: '#F3F4F6' }}>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="material-icons" style={{ fontSize: '20px', color: '#0056D2' }}>security</span>
                    <h3 className="h5 fw-semibold mb-0" style={{ color: '#111827', fontSize: '16px' }}>
                      {selectedRole.name}
                    </h3>
                  </div>
                  <p className="mb-0 small" style={{ color: '#64748B', fontSize: '12px' }}>
                    <code style={{ background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                      {selectedRole.role_key}
                    </code>
                  </p>
                </div>
                <button
                  className="btn d-flex align-items-center gap-2 fw-semibold"
                  onClick={handleSavePermissions}
                  disabled={isSaving}
                  style={{
                    height: '40px',
                    padding: '0 20px',
                    borderRadius: '8px',
                    background: isSaving ? '#9CA3AF' : '#0056D2',
                    color: 'white',
                    fontSize: '14px',
                    border: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSaving) {
                      e.currentTarget.style.background = '#0044A8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSaving) {
                      e.currentTarget.style.background = '#0056D2';
                    }
                  }}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" style={{ width: '14px', height: '14px' }}></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-icons" style={{ fontSize: '18px' }}>save</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Permissions List */}
              <div className="p-4">
                {permissionCategories.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="mb-0" style={{ color: '#94A3B8', fontSize: '13px' }}>No permissions available</p>
                  </div>
                ) : (
                  permissionCategories.map((category, categoryIndex) => (
                    <div key={category.title} className={categoryIndex > 0 ? 'mt-5' : ''}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="material-icons" style={{ fontSize: '18px', color: '#64748B' }}>category</span>
                        <h4 className="h6 fw-semibold mb-0" style={{ 
                          color: '#374151', 
                          fontSize: '14px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {category.title}
                        </h4>
                      </div>
                      <div className="row g-2">
                        {category.permissions.map(permission => {
                          const isSelected = selectedPermissionIds.has(permission.id);
                          
                          return (
                            <div key={permission.id} className="col-md-6 col-lg-4">
                              <div
                                className={clsx('permission-item d-flex align-items-center gap-3 p-3 rounded-lg cursor-pointer', {
                                  'selected': isSelected
                                })}
                                onClick={() => handlePermissionToggle(permission.id)}
                                style={{
                                  border: isSelected ? '1px solid #0056D2' : '1px solid #E5E7EB',
                                  background: isSelected ? '#EBF5FF' : '#FFFFFF',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSaving) {
                                    e.currentTarget.style.borderColor = isSelected ? '#0056D2' : '#D1D5DB';
                                    e.currentTarget.style.background = isSelected ? '#EBF5FF' : '#F9FAFB';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSaving) {
                                    e.currentTarget.style.borderColor = isSelected ? '#0056D2' : '#E5E7EB';
                                    e.currentTarget.style.background = isSelected ? '#EBF5FF' : '#FFFFFF';
                                  }
                                }}
                              >
                                <div className="form-check mb-0" style={{ minWidth: '20px' }}>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={isSelected}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                    disabled={isSaving}
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      marginTop: '2px',
                                      cursor: isSaving ? 'not-allowed' : 'pointer',
                                      accentColor: '#0056D2'
                                    }}
                                  />
                                </div>
                                <span className="small flex-grow-1" style={{ 
                                  color: isSelected ? '#111827' : '#64748B',
                                  fontSize: '13px',
                                  fontWeight: isSelected ? 500 : 400,
                                  lineHeight: '1.4'
                                }}>
                                  {permission.name}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center p-5" style={{ minHeight: '400px' }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '64px', height: '64px', background: '#F3F4F6' }}>
                <span className="material-icons" style={{ fontSize: '32px', color: '#94A3B8' }}>badge</span>
              </div>
              <p className="mb-0 fw-medium" style={{ color: '#64748B', fontSize: '14px' }}>
                Select a role to manage its permissions
              </p>
            </div>
          )}
        </div>
      </div>

      <AlertModal
        open={successModalOpen}
        title="Success"
        message="Role permissions updated successfully!"
        variant="success"
        confirmText="OK"
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
};

export default PermissionsManagementPage;
