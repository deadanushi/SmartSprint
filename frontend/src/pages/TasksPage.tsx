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
    let currentColumnId = '';
    for (const [columnId, column] of Object.entries(data.columns)) {
      if (column.taskIds.includes(taskId)) {
        currentColumnId = columnId;
        break;
      }
    }

    if (currentColumnId === newColumnId) {
      return;
    }

    const currentColumn = data.columns[currentColumnId];
    const newCurrentTaskIds = currentColumn.taskIds.filter(id => id !== taskId);

    const newColumn = data.columns[newColumnId];
    const newTargetTaskIds = [...newColumn.taskIds, taskId];

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

  return (
    <div className="page-container" style={{ marginLeft: isCollapsed ? '80px' : '280px', transition: 'margin-left 0.3s ease' }}>
      <div className="breadcrumb bg-white px-3 py-2 border-bottom d-flex align-items-center gap-2 small text-secondary">
        <span className="cursor-pointer">←</span>
        <span className="text-primary text-decoration-none cursor-pointer">Team spaces</span>
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
