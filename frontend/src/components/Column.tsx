import React from 'react';
import { useUser } from '../contexts/UserContext';
import TaskCard from './TaskCard';

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

interface Column {
  id: string;
  title: string;
  taskIds: string[];
  statusColor: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface ColumnProps {
  column: Column;
  tasks: Task[];
  users: { [key: string]: User };
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onTaskClick: (task: Task) => void;
}


const Column: React.FC<ColumnProps> = ({ column, tasks, users, onDragStart, onDragOver, onDrop, onTaskClick }) => {
  const { hasPermission } = useUser();
  const columnStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '8px',
    padding: '16px',
    minHeight: '400px',
    width: '280px',
    flexShrink: 0,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
    border: '1px solid #F4F6F8',
  };

  const columnHeaderStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #F4F6F8',
  };

  const columnTitleSectionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const statusIndicatorStyles: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  };

  const columnTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0D0D0D',
    margin: '0',
  };

  const taskCountStyles: React.CSSProperties = {
    background: '#0056D2',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    minWidth: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0, 86, 210, 0.3)',
  };

  const columnActionsStyles: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const addTaskBtnStyles: React.CSSProperties = {
    background: '#0056D2',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0, 86, 210, 0.3)',
    transition: 'all 0.3s ease',
  };

  const moreOptionsBtnStyles: React.CSSProperties = {
    background: '#F4F6F8',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  };

  const taskListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '200px',
  };

  const draggingOverStyles: React.CSSProperties = {
    ...taskListStyles,
    background: 'rgba(0, 86, 210, 0.08)',
    borderRadius: '8px',
    padding: '12px',
    border: '2px dashed #0056D2',
  };

  return (
    <div style={columnStyles}>
      <div style={columnHeaderStyles}>
        <div style={columnTitleSectionStyles}>
          <div 
            style={{
              ...statusIndicatorStyles,
              backgroundColor: column.statusColor,
            }}
          />
          <h3 style={columnTitleStyles}>{column.title}</h3>
          <div style={taskCountStyles}>{tasks.length}</div>
        </div>
        <div style={columnActionsStyles}>
          {hasPermission('canCreateTasks') && (
            <button 
              style={addTaskBtnStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4DA3FF';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0056D2';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              +
            </button>
          )}
          {hasPermission('canEditTasks') && (
            <button 
              style={moreOptionsBtnStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F4F6F8';
              }}
            >
              ⋯
            </button>
          )}
        </div>
      </div>
      
      <div 
        style={taskListStyles}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
      >
        {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              users={users}
              onDragStart={onDragStart}
              onClick={onTaskClick}
            />
        ))}
      </div>
    </div>
  );
};

export default Column;
