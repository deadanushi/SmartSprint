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

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user can access the route
  if (!canAccessRoute(currentUser, location.pathname)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F4F6F8',
        padding: '20px',
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px',
        }}>
          <span className="material-icons" style={{ 
            fontSize: '64px', 
            color: '#EF4444', 
            marginBottom: '16px', 
            display: 'block' 
          }}>
            block
          </span>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#111827', 
            margin: '0 0 8px 0' 
          }}>
            Access Denied
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#6B7280', 
            margin: '0 0 24px 0' 
          }}>
            You don't have permission to access this page.
          </p>
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <p style={{ 
              fontSize: '14px', 
              color: '#DC2626', 
              margin: '0',
              fontWeight: '500'
            }}>
              Required Role: {requiredPermissions.length > 0 ? requiredPermissions.join(', ') : 'Specific permissions'}
            </p>
            <p style={{ 
              fontSize: '14px', 
              color: '#DC2626', 
              margin: '4px 0 0 0'
            }}>
              Your Role: {currentUser.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          <button
            style={{
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => window.history.back()}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D4ED8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563EB';
            }}
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

