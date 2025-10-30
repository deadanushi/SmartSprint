import React, { useState } from 'react';
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

interface User {
  id: string;
  name: string;
  avatar: string;
}

const BacklogPage: React.FC = () => {
  const { hasPermission, currentUser } = useUser();
  const { isCollapsed } = useSidebar();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock backlog data - replace with actual API call
  const backlogTasks: Task[] = [
    {
      id: 'backlog-1',
      title: 'User Profile Management System',
      description: 'Complete user profile management with avatar upload, preferences, and settings',
      status: 'Backlog',
      priority: 'High',
      dueDate: '30 Apr 2024',
      assignees: [],
      comments: 0,
      links: 0,
      progress: '0/8',
      type: 'frontend',
      createdAt: '2024-01-10',
      estimatedHours: 40,
      tags: ['UI', 'User Management', 'File Upload']
    },
    {
      id: 'backlog-2',
      title: 'Advanced Search Functionality',
      description: 'Implement advanced search with filters, sorting, and pagination',
      status: 'Backlog',
      priority: 'Medium',
      dueDate: '15 May 2024',
      assignees: [],
      comments: 0,
      links: 0,
      progress: '0/12',
      type: 'backend',
      createdAt: '2024-01-12',
      estimatedHours: 60,
      tags: ['Search', 'API', 'Performance']
    },
    {
      id: 'backlog-3',
      title: 'Mobile App Redesign',
      description: 'Complete redesign of mobile app with new UI/UX patterns',
      status: 'Backlog',
      priority: 'High',
      dueDate: '20 May 2024',
      assignees: [],
      comments: 0,
      links: 0,
      progress: '0/15',
      type: 'design',
      createdAt: '2024-01-15',
      estimatedHours: 80,
      tags: ['Mobile', 'UI/UX', 'Design System']
    },
    {
      id: 'backlog-4',
      title: 'Automated Testing Suite',
      description: 'Implement comprehensive automated testing for all components',
      status: 'Backlog',
      priority: 'Medium',
      dueDate: '25 May 2024',
      assignees: [],
      comments: 0,
      links: 0,
      progress: '0/10',
      type: 'test',
      createdAt: '2024-01-18',
      estimatedHours: 50,
      tags: ['Testing', 'Automation', 'Quality Assurance']
    },
    {
      id: 'backlog-5',
      title: 'Microservices Architecture Migration',
      description: 'Migrate monolithic architecture to microservices',
      status: 'Backlog',
      priority: 'High',
      dueDate: '30 Jun 2024',
      assignees: [],
      comments: 0,
      links: 0,
      progress: '0/20',
      type: 'devops',
      createdAt: '2024-01-20',
      estimatedHours: 120,
      tags: ['Architecture', 'DevOps', 'Scalability']
    },
    {
      id: 'backlog-6',
      title: 'Analytics Dashboard Enhancement',
      description: 'Enhance analytics dashboard with real-time data and custom reports',
      status: 'Backlog',
      priority: 'Low',
      dueDate: '10 Jul 2024',
      assignees: [],
      comments: 0,
      links: 0,
      progress: '0/8',
      type: 'data',
      createdAt: '2024-01-22',
      estimatedHours: 35,
      tags: ['Analytics', 'Dashboard', 'Real-time']
    }
  ];

  const mockUsers: { [key: string]: User } = {
    'user-1': { id: 'user-1', name: 'John Doe', avatar: 'JD' },
    'user-2': { id: 'user-2', name: 'Jane Smith', avatar: 'JS' },
    'user-3': { id: 'user-3', name: 'Mike Johnson', avatar: 'MJ' },
    'user-4': { id: 'user-4', name: 'Sarah Wilson', avatar: 'SW' },
    'user-5': { id: 'user-5', name: 'David Brown', avatar: 'DB' },
    'user-6': { id: 'user-6', name: 'Lisa Davis', avatar: 'LD' }
  };

  // Check if user has permission to access backlog
  if (!hasPermission('canViewProjectOverview')) {
    return (
      <div style={{
        marginLeft: isCollapsed ? '80px' : '280px',
        minHeight: '100vh',
        background: '#F4F6F8',
        padding: '32px',
        transition: 'margin-left 0.3s ease',
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <span className="material-icons" style={{ fontSize: '64px', color: '#6B7280', marginBottom: '16px', display: 'block' }}>
            lock
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>
            Access Denied
          </h1>
          <p style={{ fontSize: '16px', color: '#6B7280', margin: '0' }}>
            Only Project Managers can access the Backlog view.
          </p>
        </div>
      </div>
    );
  }

  const pageStyles: React.CSSProperties = {
    marginLeft: isCollapsed ? '80px' : '280px',
    minHeight: '100vh',
    background: '#F4F6F8',
    transition: 'margin-left 0.3s ease',
  };

  const breadcrumbStyles: React.CSSProperties = {
    padding: '12px 24px',
    background: '#FFFFFF',
    borderBottom: '1px solid #F4F6F8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280',
  };

  const breadcrumbLinkStyles: React.CSSProperties = {
    color: '#0056D2',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const headerStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    margin: '24px',
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
    margin: '0 0 24px 0',
  };

  const filtersStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const filterGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const filterLabelStyles: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const selectStyles: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    background: '#FFFFFF',
    minWidth: '120px',
  };

  const searchInputStyles: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    background: '#FFFFFF',
    minWidth: '200px',
  };

  const contentStyles: React.CSSProperties = {
    padding: '0 24px 24px 24px',
  };

  const tasksGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  };

  const taskCardStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #F4F6F8',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  const taskHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  };

  const taskTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
  };

  const taskDescriptionStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const taskMetaStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const priorityTagStyles: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const typeTagStyles: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '12px',
    background: '#F3F4F6',
    color: '#6B7280',
  };

  const taskFooterStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #F4F6F8',
  };

  const estimatedHoursStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6B7280',
    fontWeight: '500',
  };

  const createdAtStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#9CA3AF',
  };

  const tagsStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px',
  };

  const tagStyles: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '500',
    padding: '2px 6px',
    borderRadius: '8px',
    background: '#EBF5FF',
    color: '#2563EB',
  };

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
    // TODO: Implement task details modal or navigation
    console.log('Task clicked:', task);
  };

  const handleMoveToSprint = (taskId: string) => {
    // TODO: Implement move to sprint functionality
    console.log('Move to sprint:', taskId);
  };

  return (
    <div style={pageStyles}>
      <div style={breadcrumbStyles}>
        <Link to="/" style={breadcrumbLinkStyles}>Home</Link>
        <span>›</span>
        <span>Backlog</span>
      </div>

      <div style={headerStyles}>
        <h1 style={titleStyles}>Project Backlog</h1>
        <p style={subtitleStyles}>
          Manage and prioritize tasks for upcoming sprints. Only Project Managers can access this view.
        </p>
        
        <div style={filtersStyles}>
          <div style={filterGroupStyles}>
            <label style={filterLabelStyles}>Search</label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyles}
            />
          </div>
          
          <div style={filterGroupStyles}>
            <label style={filterLabelStyles}>Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={selectStyles}
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <div style={filterGroupStyles}>
            <label style={filterLabelStyles}>Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={selectStyles}
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

      <div style={contentStyles}>
        <div style={tasksGridStyles}>
          {filteredTasks.map(task => (
            <div
              key={task.id}
              style={taskCardStyles}
              onClick={() => handleTaskClick(task)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={taskHeaderStyles}>
                <h3 style={taskTitleStyles}>{task.title}</h3>
                <div 
                  style={{
                    ...priorityTagStyles,
                    color: getPriorityColor(task.priority),
                    backgroundColor: getPriorityBgColor(task.priority),
                  }}
                >
                  {task.priority}
                </div>
              </div>
              
              <p style={taskDescriptionStyles}>{task.description}</p>
              
              <div style={tagsStyles}>
                <div 
                  style={{
                    ...typeTagStyles,
                    color: getTypeColor(task.type),
                    backgroundColor: getTypeBgColor(task.type),
                  }}
                >
                  {task.type}
                </div>
                {task.tags.map(tag => (
                  <span key={tag} style={tagStyles}>{tag}</span>
                ))}
              </div>
              
              <div style={taskMetaStyles}>
                <div style={estimatedHoursStyles}>
                  <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>event</span>{' '}
                  Due: {task.dueDate}
                </div>
                <div style={estimatedHoursStyles}>
                  <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle' }}>access_time</span>{' '}
                  {task.estimatedHours}h
                </div>
              </div>
              
              <div style={taskFooterStyles}>
                <div style={createdAtStyles}>
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </div>
                {hasPermission('canCreateSprints') && (
                  <button
                    style={{
                      background: '#2563EB',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveToSprint(task.id);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1D4ED8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2563EB';
                    }}
                  >
                    Move to Sprint
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6B7280',
          }}>
            <span className="material-icons" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>
              inbox
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
              No tasks found
            </h3>
            <p style={{ fontSize: '14px', margin: '0' }}>
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklogPage;

