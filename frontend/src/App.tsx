import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import { UserProvider, useUser } from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import DashboardPage from './pages/DashboardPage';
import InboxPage from './pages/InboxPage';
import CalendarPage from './pages/CalendarPage';
import BacklogPage from './pages/BacklogPage';
import PermissionsManagementPage from './pages/PermissionsManagementPage';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useUser();

  const appStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: '#F4F6F8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  };

  const loadingStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: '#F4F6F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  };

  const loadingCardStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  if (isLoading) {
    return (
      <div style={loadingStyles}>
        <div style={loadingCardStyles}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #F3F4F6',
            borderTop: '4px solid #2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto',
          }} />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
            Loading...
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>
            Initializing your workspace
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <AppHeader />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Main App Routes */}
        <Route path="/*" element={
          <SidebarProvider>
            <div style={appStyles}>
              <Sidebar />
              <Routes>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/inbox" element={
                  <ProtectedRoute>
                    <InboxPage />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                } />
                <Route path="/backlog" element={
                  <ProtectedRoute requiredPermissions={['canViewProjectOverview']}>
                    <BacklogPage />
                  </ProtectedRoute>
                } />
                <Route path="/permissions" element={
                  <ProtectedRoute requiredPermissions={['canManagePermissions']}>
                    <PermissionsManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/docs" element={
                  <ProtectedRoute>
                    <div style={{ marginLeft: '280px', padding: '50px', textAlign: 'center', color: '#6B7280' }}>Docs Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="/meeting" element={
                  <ProtectedRoute>
                    <div style={{ marginLeft: '280px', padding: '50px', textAlign: 'center', color: '#6B7280' }}>Meeting Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <div style={{ marginLeft: '280px', padding: '50px', textAlign: 'center', color: '#6B7280' }}>Settings Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="/support" element={
                  <ProtectedRoute>
                    <div style={{ marginLeft: '280px', padding: '50px', textAlign: 'center', color: '#6B7280' }}>Support Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </SidebarProvider>
        } />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;