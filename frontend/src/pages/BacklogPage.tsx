import React, { useState } from 'react';
import clsx from 'clsx';
import { useUser } from '../contexts/UserContext';
import { useSidebar } from '../contexts/SidebarContext';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignees: string[];
  comments: number;
  links: number;
  progress: string;
  type: string;
  createdAt: string;
  estimatedHours: number;
  tags: string[];
}

const BacklogPage: React.FC = () => {
  const { hasPermission, currentUser } = useUser();
  const { isCollapsed } = useSidebar();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const backlogTasks: Task[] = [
    {
      id: 'backlog-1', title: 'User Profile Management System',
      description: 'Complete user profile management with avatar upload, preferences, and settings',
      status: 'Backlog', priority: 'High', dueDate: '30 Apr 2024', assignees: [], comments: 0, links: 0,
      progress: '0/8', type: 'frontend', createdAt: '2024-01-10', estimatedHours: 40,
      tags: ['UI', 'User Management', 'File Upload']
    },
    {
      id: 'backlog-2', title: 'Advanced Search Functionality',
      description: 'Implement advanced search with filters, sorting, and pagination',
      status: 'Backlog', priority: 'Medium', dueDate: '15 May 2024', assignees: [], comments: 0, links: 0,
      progress: '0/12', type: 'backend', createdAt: '2024-01-12', estimatedHours: 60,
      tags: ['Search', 'API', 'Performance']
    },
    {
      id: 'backlog-3', title: 'Mobile App Redesign',
      description: 'Complete redesign of mobile app with new UI/UX patterns',
      status: 'Backlog', priority: 'High', dueDate: '20 May 2024', assignees: [], comments: 0, links: 0,
      progress: '0/15', type: 'design', createdAt: '2024-01-15', estimatedHours: 80,
      tags: ['Mobile', 'UI/UX', 'Design System']
    },
    {
      id: 'backlog-4', title: 'Automated Testing Suite',
      description: 'Implement comprehensive automated testing for all components',
      status: 'Backlog', priority: 'Medium', dueDate: '25 May 2024', assignees: [], comments: 0, links: 0,
      progress: '0/10', type: 'test', createdAt: '2024-01-18', estimatedHours: 50,
      tags: ['Testing', 'Automation', 'Quality Assurance']
    },
    {
      id: 'backlog-5', title: 'Microservices Architecture Migration',
      description: 'Migrate monolithic architecture to microservices',
      status: 'Backlog', priority: 'High', dueDate: '30 Jun 2024', assignees: [], comments: 0, links: 0,
      progress: '0/20', type: 'devops', createdAt: '2024-01-20', estimatedHours: 120,
      tags: ['Architecture', 'DevOps', 'Scalability']
    },
    {
      id: 'backlog-6', title: 'Analytics Dashboard Enhancement',
      description: 'Enhance analytics dashboard with real-time data and custom reports',
      status: 'Backlog', priority: 'Low', dueDate: '10 Jul 2024', assignees: [], comments: 0, links: 0,
      progress: '0/8', type: 'data', createdAt: '2024-01-22', estimatedHours: 35,
      tags: ['Analytics', 'Dashboard', 'Real-time']
    }
  ];

  if (!hasPermission('canViewProjectOverview')) {
    return (
      <div className="page-container" style={{ marginLeft: isCollapsed ? '80px' : '280px', transition: 'margin-left 0.3s ease' }}>
        <div className="p-4">
          <div className="bg-white rounded-3 p-5 text-center shadow-sm">
            <span className="material-icons d-block mb-3" style={{ fontSize: '64px', color: '#6B7280' }}>lock</span>
            <h1 className="h4 fw-semibold text-dark mb-2">Access Denied</h1>
            <p className="text-secondary mb-0">
              Only Project Managers can access the Backlog view.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityBgColor = (priority: string): string => {
    switch (priority) {
      case 'Low': return '#ecfdf5';
      case 'Medium': return '#fffbeb';
      case 'High': return '#fef2f2';
      default: return '#f9fafb';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'frontend': return '#3b82f6';
      case 'backend': return '#8b5cf6';
      case 'design': return '#f97316';
      case 'test': return '#10b981';
      case 'devops': return '#ef4444';
      case 'data': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getTypeBgColor = (type: string): string => {
    switch (type) {
      case 'frontend': return '#eff6ff';
      case 'backend': return '#eef2ff';
      case 'design': return '#fff7ed';
      case 'test': return '#ecfdf5';
      case 'devops': return '#fef2f2';
      case 'data': return '#ecfeff';
      default: return '#f9fafb';
    }
  };

  const filteredTasks = backlogTasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesPriority && matchesType && matchesSearch;
  });

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  const handleMoveToSprint = (taskId: string) => {
    console.log('Move to sprint:', taskId);
  };

  return (
    <div className="page-container" style={{ marginLeft: isCollapsed ? '80px' : '280px', transition: 'margin-left 0.3s ease' }}>
      <div className="breadcrumb bg-white px-3 py-2 border-bottom d-flex align-items-center gap-2 small text-secondary">
        <Link to="/" className="text-primary text-decoration-none cursor-pointer">Home</Link>
        <span>›</span>
        <span>Backlog</span>
      </div>

      <div className="bg-white rounded-3 p-4 m-3 shadow-sm">
        <h1 className="display-6 fw-bold text-dark mb-2">Project Backlog</h1>
        <p className="fs-6 text-secondary mb-4">
          Manage and prioritize tasks for upcoming sprints. Only Project Managers can access this view.
        </p>
        
        <div className="d-flex gap-3 flex-wrap align-items-end">
          <div className="d-flex flex-column gap-1">
            <label className="small fw-semibold text-secondary text-uppercase">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: '200px' }}
            />
          </div>
          
          <div className="d-flex flex-column gap-1">
            <label className="small fw-semibold text-secondary text-uppercase">Priority</label>
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div className="d-flex flex-column gap-1">
            <label className="small fw-semibold text-secondary text-uppercase">Type</label>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ minWidth: '120px' }}
            >
              <option value="all">All Types</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="design">Design</option>
              <option value="test">Test</option>
              <option value="devops">DevOps</option>
              <option value="data">Data</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="row g-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="col-md-6 col-lg-4">
              <div
                className="backlog-task-card bg-white rounded-3 p-4 shadow-sm border cursor-pointer h-100"
                onClick={() => handleTaskClick(task)}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h6 fw-semibold text-dark mb-2">{task.title}</h3>
                  <div 
                    className="small fw-semibold rounded-pill px-2 py-1 text-uppercase"
                    style={{
                      color: getPriorityColor(task.priority),
                      backgroundColor: getPriorityBgColor(task.priority),
                    }}
                  >
                    {task.priority}
                  </div>
                </div>
                
                <p className="small text-secondary mb-3 backlog-task-description">{task.description}</p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <div 
                    className="small fw-medium rounded-pill px-2 py-1"
                    style={{
                      color: getTypeColor(task.type),
                      backgroundColor: getTypeBgColor(task.type),
                    }}
                  >
                    {task.type}
                  </div>
                  {task.tags.map(tag => (
                    <span key={tag} className="backlog-tag badge bg-primary">{tag}</span>
                  ))}
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="small text-secondary fw-medium">
                    <span className="material-icons align-middle" style={{ fontSize: '14px' }}>event</span>{' '}
                    Due: {task.dueDate}
                  </div>
                  <div className="small text-secondary fw-medium">
                    <span className="material-icons align-middle" style={{ fontSize: '14px' }}>access_time</span>{' '}
                    {task.estimatedHours}h
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div className="small text-muted">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  {hasPermission('canCreateSprints') && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveToSprint(task.id);
                      }}
                    >
                      Move to Sprint
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center p-5 text-secondary">
            <span className="material-icons d-block mb-3" style={{ fontSize: '48px' }}>inbox</span>
            <h3 className="h6 fw-semibold mb-2">No tasks found</h3>
            <p className="small mb-0">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklogPage;
