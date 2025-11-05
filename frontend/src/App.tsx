import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { ProjectProvider } from './contexts/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import TasksPage from './pages/TasksPage';
import DashboardPage from './pages/DashboardPage';
import InboxPage from './pages/InboxPage';
import CalendarPage from './pages/CalendarPage';
import BacklogPage from './pages/BacklogPage';
import PermissionsManagementPage from './pages/PermissionsManagementPage';
import ProjectPage from './pages/ProjectPage';

const MainContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div 
      className="main-content-wrapper" 
      style={{ 
        marginLeft: isCollapsed ? '80px' : '280px', 
        transition: 'margin-left 0.3s ease',
        width: `calc(100% - ${isCollapsed ? '80px' : '280px'})`,
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="app-background d-flex align-items-center justify-content-center">
        <div className="bg-white rounded-3 p-5 text-center shadow-sm">
          <div className="loading-spinner mx-auto mb-3"></div>
          <h2 className="h5 fw-semibold text-dark mb-2">Loading...</h2>
          <p className="text-secondary mb-0">Initializing your workspace</p>
        </div>
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
          <ProjectProvider>
            <SidebarProvider>
              <div className="app-background d-flex">
                <Sidebar />
                <MainContentWrapper>
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
                  <Route path="/project/:projectId" element={
                    <ProtectedRoute>
                      <ProjectPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/project/:projectId/tasks" element={
                    <ProtectedRoute>
                      <ProjectPage defaultTab="tasks" />
                    </ProtectedRoute>
                  } />
                  <Route path="/project/:projectId/backlog" element={
                    <ProtectedRoute requiredPermissions={['canViewProjectOverview']}>
                      <ProjectPage defaultTab="backlog" />
                    </ProtectedRoute>
                  } />
                  <Route path="/project/:projectId/docs" element={
                    <ProtectedRoute>
                      <ProjectPage defaultTab="docs" />
                    </ProtectedRoute>
                  } />
                  <Route path="/project/:projectId/meeting" element={
                    <ProtectedRoute>
                      <ProjectPage defaultTab="meeting" />
                    </ProtectedRoute>
                  } />
                  <Route path="/permissions" element={
                    <ProtectedRoute requiredPermissions={['canManagePermissions']}>
                      <PermissionsManagementPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/docs" element={
                    <ProtectedRoute>
                      <div className="ms-5 ps-5 pt-5 text-center text-secondary">Docs Page - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/meeting" element={
                    <ProtectedRoute>
                      <div className="ms-5 ps-5 pt-5 text-center text-secondary">Meeting Page - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <div className="ms-5 ps-5 pt-5 text-center text-secondary">Settings Page - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/support" element={
                    <ProtectedRoute>
                      <div className="ms-5 ps-5 pt-5 text-center text-secondary">Support Page - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                </Routes>
                </MainContentWrapper>
              </div>
            </SidebarProvider>
          </ProjectProvider>
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
