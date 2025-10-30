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

interface TaskCardProps {
  task: Task;
  index: number;
  users: { [key: string]: User };
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, users, onDragStart, onClick }) => {
  const { canSeeTaskType, hasPermission } = useUser();

  // Check if user can see this task type
  if (!canSeeTaskType(task.type)) {
    return null; // Don't render the task if user can't see it
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

  const getAssignees = (): User[] => {
    return task.assignees.map(userId => users[userId]).filter(Boolean);
  };

  const taskCardStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    cursor: 'grab',
    transition: 'all 0.2s ease',
    border: '1px solid #F4F6F8',
    position: 'relative',
    overflow: 'hidden',
  };

  const taskTitleStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0D0D0D',
    margin: '0 0 16px 0',
    lineHeight: '1.4',
  };

  const taskDescriptionStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6B7280',
    margin: '0 0 24px 0',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const taskAssigneesStyles: React.CSSProperties = {
    display: 'flex',
    gap: '-4px',
    marginBottom: '24px',
  };

  const assigneeAvatarStyles: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#0056D2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '600',
    marginLeft: '-4px',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0, 86, 210, 0.2)',
  };

  const taskFooterStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const taskDueDateStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: '#6B7280',
    fontWeight: '500',
  };

  const priorityTagStyles: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div
      style={taskCardStyles}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}
    >
      <h4 style={taskTitleStyles}>{task.title}</h4>
      <p style={taskDescriptionStyles}>{task.description}</p>
      
      <div style={taskAssigneesStyles}>
        {getAssignees().map(user => (
          <div key={user.id} style={assigneeAvatarStyles}>
            {user.avatar}
          </div>
        ))}
      </div>
      
      <div style={taskFooterStyles}>
        <div style={taskDueDateStyles}>
          <span className="material-icons" style={{ fontSize: '16px' }}>event</span>
          {task.dueDate}
        </div>
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
    </div>
  );
};

export default TaskCard;