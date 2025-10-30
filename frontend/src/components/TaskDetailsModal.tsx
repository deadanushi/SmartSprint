import React from 'react';
import { useUser } from '../contexts/UserContext';

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
  type: string; // Added task type for permission checking
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface TaskDetailsModalProps {
  task: Task | null;
  users: { [key: string]: User };
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, users, isOpen, onClose }) => {
  const { hasPermission } = useUser();
  if (!isOpen || !task) return null;

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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'To Do': return '#6b7280';
      case 'In Progress': return '#3b82f6';
      case 'Waiting Review': return '#8b5cf6';
      case 'Testing': return '#f97316';
      case 'Done': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case 'To Do': return '#f9fafb';
      case 'In Progress': return '#eff6ff';
      case 'Waiting Review': return '#f3e8ff';
      case 'Testing': return '#fff7ed';
      case 'Done': return '#ecfdf5';
      default: return '#f9fafb';
    }
  };

  const getAssignees = (): User[] => {
    return task.assignees.map(userId => users[userId]).filter(Boolean);
  };

  const modalOverlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  };

  const modalStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    position: 'relative',
  };

  const closeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#F4F6F8',
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6B7280',
    transition: 'all 0.2s ease',
    zIndex: 10,
  };

  const headerStyles: React.CSSProperties = {
    padding: '32px 32px 24px 32px',
    borderBottom: '1px solid #F4F6F8',
  };

  const statusBadgeStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  };

  const taskTitleStyles: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0D0D0D',
    margin: '0 0 16px 0',
    lineHeight: '1.3',
    paddingRight: '40px',
  };

  const taskDescriptionStyles: React.CSSProperties = {
    fontSize: '16px',
    color: '#6B7280',
    lineHeight: '1.6',
    margin: '0',
    fontStyle: 'italic',
  };

  const contentStyles: React.CSSProperties = {
    display: 'flex',
    gap: '32px',
    padding: '32px',
  };

  const mainContentStyles: React.CSSProperties = {
    flex: 1,
  };

  const sidebarStyles: React.CSSProperties = {
    width: '240px',
    flexShrink: 0,
  };

  const sectionStyles: React.CSSProperties = {
    marginBottom: '32px',
  };

  const sectionTitleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0D0D0D',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const commentsSectionStyles: React.CSSProperties = {
    background: '#F9FAFB',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #F4F6F8',
  };

  const commentStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #F4F6F8',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const commentHeaderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  };

  const commentAuthorStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0D0D0D',
  };

  const commentTimeStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6B7280',
  };

  const commentTextStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
    margin: '0',
  };

  const sidebarSectionStyles: React.CSSProperties = {
    background: '#F9FAFB',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid #F4F6F8',
  };

  const priorityTagStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  };

  const statusTagStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  };

  const infoItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: '8px',
  };

  const assigneesContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const assigneeStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 8px',
    background: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#0D0D0D',
    border: '1px solid #F4F6F8',
  };

  const assigneeAvatarStyles: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#0056D2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: '600',
  };

  const metricsContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const metricStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280',
    fontWeight: '500',
    padding: '6px 8px',
    background: '#FFFFFF',
    borderRadius: '6px',
    border: '1px solid #F4F6F8',
  };

  // Sample comments data
  const sampleComments = [
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      time: '2 hours ago',
      text: 'This task looks good to me. The implementation follows our coding standards.'
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: 'JS',
      time: '1 day ago',
      text: 'I\'ve reviewed the requirements and everything seems to be in order. Ready for testing.'
    }
  ];

  return (
    <div style={modalOverlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <button 
          style={closeButtonStyles}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F4F6F8';
          }}
        >
          ×
        </button>

        <div style={headerStyles}>
          <div 
            style={{
              ...statusBadgeStyles,
              color: getStatusColor(task.status),
              backgroundColor: getStatusBgColor(task.status),
            }}
          >
            {task.status}
          </div>
          <h1 style={taskTitleStyles}>{task.title}</h1>
          <p style={taskDescriptionStyles}>{task.description}</p>
        </div>

        <div style={contentStyles}>
          <div style={mainContentStyles}>
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Comments</h3>
              <div style={commentsSectionStyles}>
                {hasPermission('canViewAllComments') && (
                  <>
                    {sampleComments.map(comment => (
                      <div key={comment.id} style={commentStyles}>
                        <div style={commentHeaderStyles}>
                          <div style={assigneeAvatarStyles}>{comment.avatar}</div>
                          <span style={commentAuthorStyles}>{comment.author}</span>
                          <span style={commentTimeStyles}>{comment.time}</span>
                        </div>
                        <p style={commentTextStyles}>{comment.text}</p>
                      </div>
                    ))}
                  </>
                )}
                {hasPermission('canAddComments') && (
                  <div style={{
                    ...commentStyles,
                    background: '#F4F6F8',
                    border: '2px dashed #D1D5DB',
                    textAlign: 'center',
                    color: '#6B7280',
                    fontStyle: 'italic',
                    cursor: 'pointer',
                  }}>
                    Add a comment...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={sidebarStyles}>
            <div style={sidebarSectionStyles}>
              <h3 style={sectionTitleStyles}>Priority & Status</h3>
              <div 
                style={{
                  ...priorityTagStyles,
                  color: getPriorityColor(task.priority),
                  backgroundColor: getPriorityBgColor(task.priority),
                }}
              >
                {task.priority}
              </div>
              <div 
                style={{
                  ...statusTagStyles,
                  color: getStatusColor(task.status),
                  backgroundColor: getStatusBgColor(task.status),
                }}
              >
                {task.status}
              </div>
            </div>

            <div style={sidebarSectionStyles}>
              <h3 style={sectionTitleStyles}>Due Date</h3>
              <div style={infoItemStyles}>
                <span className="material-icons" style={{ fontSize: '16px' }}>event</span>
                {task.dueDate}
              </div>
            </div>

            <div style={sidebarSectionStyles}>
              <h3 style={sectionTitleStyles}>Team</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>Assignees</div>
                <div style={assigneesContainerStyles}>
                  {getAssignees().map(user => (
                    <div key={user.id} style={assigneeStyles}>
                      <div style={assigneeAvatarStyles}>
                        {user.avatar}
                      </div>
                      {user.name}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>Reviewer</div>
                <div style={assigneesContainerStyles}>
                  <div style={assigneeStyles}>
                    <div style={assigneeAvatarStyles}>RS</div>
                    Review Supervisor
                  </div>
                </div>
              </div>
            </div>

            <div style={sidebarSectionStyles}>
              <h3 style={sectionTitleStyles}>Metrics</h3>
              <div style={metricsContainerStyles}>
                <div style={metricStyles}>
                  <span className="material-icons" style={{ fontSize: '16px' }}>comment</span>
                  {task.comments} Comments
                </div>
                <div style={metricStyles}>
                  <span className="material-icons" style={{ fontSize: '16px' }}>link</span>
                  {task.links} Links
                </div>
                <div style={metricStyles}>
                  <span className="material-icons" style={{ fontSize: '16px' }}>assessment</span>
                  Progress: {task.progress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;