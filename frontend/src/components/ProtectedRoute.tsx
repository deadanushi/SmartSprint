import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { canAccessRoute } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [], 
  redirectTo = '/login' 
}) => {
  const { currentUser } = useUser();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!canAccessRoute(currentUser, location.pathname)) {
    return (
      <div className="app-background d-flex flex-column align-items-center justify-content-center min-vh-100 p-4">
        <div className="bg-white rounded-3 p-5 text-center shadow-sm" style={{ maxWidth: '500px' }}>
          <span className="material-icons d-block mb-3" style={{ fontSize: '64px', color: '#EF4444' }}>
            block
          </span>
          <h1 className="h4 fw-semibold text-dark mb-2">Access Denied</h1>
          <p className="text-secondary mb-4">
            You don't have permission to access this page.
          </p>
          <div className="alert alert-danger mb-4">
            <p className="mb-1 fw-medium">Required Role: {requiredPermissions.length > 0 ? requiredPermissions.join(', ') : 'Specific permissions'}</p>
            <p className="mb-0">
              Your Role: {currentUser.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
