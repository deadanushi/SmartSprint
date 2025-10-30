import React, { useState } from 'react';
import { useSidebar } from '../contexts/SidebarContext';
import HeaderComponent from '../components/HeaderComponent';
import BoardComponent from '../components/Board';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { initialData } from '../data/sampleData';

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

interface Data {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
  users: { [key: string]: User };
}

const TasksPage: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [data, setData] = useState<Data>(initialData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    moveTask(taskId, newColumnId);
  };

  const moveTask = (taskId: string, newColumnId: string) => {
    // Find current column
    let currentColumnId = '';
    for (const [columnId, column] of Object.entries(data.columns)) {
      if (column.taskIds.includes(taskId)) {
        currentColumnId = columnId;
        break;
      }
    }

    if (currentColumnId === newColumnId) {
      return; // Task is already in this column
    }

    // Remove task from current column
    const currentColumn = data.columns[currentColumnId];
    const newCurrentTaskIds = currentColumn.taskIds.filter(id => id !== taskId);

    // Add task to new column
    const newColumn = data.columns[newColumnId];
    const newTargetTaskIds = [...newColumn.taskIds, taskId];

    // Update state
    setData(prevData => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [currentColumnId]: {
          ...currentColumn,
          taskIds: newCurrentTaskIds,
        },
        [newColumnId]: {
          ...newColumn,
          taskIds: newTargetTaskIds,
        },
      },
    }));
  };

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

  return (
    <div style={pageStyles}>
      <div style={breadcrumbStyles}>
        <span style={{ cursor: 'pointer' }}>←</span>
        <span style={breadcrumbLinkStyles}>Team spaces</span>
        <span>›</span>
        <span>Tasks</span>
      </div>
      
      <HeaderComponent />
      <BoardComponent 
        data={data} 
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onTaskClick={handleTaskClick}
      />
      
      <TaskDetailsModal
        task={selectedTask}
        users={data.users}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TasksPage;
