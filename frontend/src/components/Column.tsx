import React, { useState } from 'react';
import clsx from 'clsx';
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
  type: string;
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  return (
    <div className="column-container bg-white rounded p-3 shadow-sm border">
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="status-indicator rounded-circle"
            style={{ 
              width: '8px', 
              height: '8px', 
              backgroundColor: column.statusColor,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
            }}
          />
          <h3 className="h6 fw-semibold text-dark mb-0">{column.title}</h3>
          <div className="task-count-badge bg-primary text-white small fw-semibold rounded-pill px-2">
            {tasks.length}
          </div>
        </div>
        <div className="d-flex gap-2">
          {hasPermission('canCreateTasks') && (
            <button className="btn btn-primary btn-sm p-1 rounded" style={{ width: '28px', height: '28px' }}>
              +
            </button>
          )}
          {hasPermission('canEditTasks') && (
            <button className="btn btn-outline-secondary btn-sm p-1 rounded" style={{ width: '28px', height: '28px' }}>
              ⋯
            </button>
          )}
        </div>
      </div>
      
      <div 
        className={clsx('d-flex flex-column gap-3', { 'column-drag-over': isDraggingOver })}
        onDragOver={(e) => {
          onDragOver(e);
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          onDrop(e, column.id);
          setIsDraggingOver(false);
        }}
        style={{ minHeight: '200px' }}
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
