import React from 'react';
import clsx from 'clsx';
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
  type: string;
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
  const { canSeeTaskType } = useUser();

  if (!canSeeTaskType(task.type)) {
    return null;
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

  return (
    <div
      className="task-card bg-white rounded-3 p-4 shadow-sm border cursor-grab"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
    >
      <h4 className="task-card-title fw-semibold text-dark mb-3">{task.title}</h4>
      <p className="task-card-description text-secondary small mb-4">{task.description}</p>
      
      <div className="d-flex gap-1 mb-4">
        {getAssignees().map(user => (
          <div key={user.id} className="assignee-avatar-small">
            {user.avatar}
          </div>
        ))}
      </div>
      
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-1 small text-secondary fw-medium">
          <span className="material-icons" style={{ fontSize: '16px' }}>event</span>
          {task.dueDate}
        </div>
        <div 
          className="priority-badge small fw-bold text-uppercase"
          style={{
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
