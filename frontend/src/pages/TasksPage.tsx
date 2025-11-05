import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useProjects } from '../contexts/ProjectContext';
import HeaderComponent from '../components/HeaderComponent';
import BoardComponent from '../components/Board';
import TaskDetailsModal from '../components/TaskDetailsModal';
import TaskCreationModal from '../components/TaskCreationModal';
import { updateTask } from '../services/taskService';
import { useTaskPageData } from '../hooks/useTaskPageData';
import type { TaskDto } from '../services/taskService';
import type { UIBoardData, UITask } from '../types/ui';

// Status mapping: column id -> backend status key
const STATUS_MAP: { [key: string]: string } = {
  'column-1': 'to-do',
  'column-2': 'in-progress',
  'column-3': 'waiting-review',
  'column-4': 'testing',
  'column-5': 'done',
};

// Status display mapping
const STATUS_DISPLAY_MAP: { [key: string]: string } = {
  'to-do': 'To Do',
  'in-progress': 'In Progress',
  'waiting-review': 'Waiting Review',
  'testing': 'Testing',
  'done': 'Done',
};

// Priority display mapping
const PRIORITY_DISPLAY_MAP: { [key: string]: string } = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
};

// Get column ID from status key
const getColumnIdFromStatus = (statusKey: string | null): string => {
  if (!statusKey) return 'column-1'; // Default to 'to-do'
  const entry = Object.entries(STATUS_MAP).find(([_, key]) => key === statusKey);
  return entry ? entry[0] : 'column-1';
};


const TasksPage: React.FC = () => {
  const { currentUser } = useUser();
  const { currentProject } = useProjects();
  const { projectId } = useParams<{ projectId?: string }>();
  
  const [data, setData] = useState<UIBoardData>({
    tasks: {},
    columns: {
      'column-1': { id: 'column-1', title: 'To Do', taskIds: [], statusColor: '#6b7280', statusKey: 'to-do' },
      'column-2': { id: 'column-2', title: 'In Progress', taskIds: [], statusColor: '#3b82f6', statusKey: 'in-progress' },
      'column-3': { id: 'column-3', title: 'Waiting Review', taskIds: [], statusColor: '#8b5cf6', statusKey: 'waiting-review' },
      'column-4': { id: 'column-4', title: 'Testing', taskIds: [], statusColor: '#f97316', statusKey: 'testing' },
      'column-5': { id: 'column-5', title: 'Done', taskIds: [], statusColor: '#10b981', statusKey: 'done' },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
    users: {},
  });
  
  const [selectedTask, setSelectedTask] = useState<UITask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskDto | null>(null);
  const [createTaskStatusKey, setCreateTaskStatusKey] = useState<string>('to-do');
  
  // Determine project ID
  const targetProjectId = projectId ? parseInt(projectId) : currentProject?.id;
  
  // Use custom hook to aggregate task and user data
  const { data: taskPageData, loading, error, refetch: fetchTasks } = useTaskPageData({
    projectId: targetProjectId,
    enabled: !!currentUser,
  });

  // Update local data when hook data changes
  useEffect(() => {
    if (taskPageData) {
      const columnTasks: { [key: string]: string[] } = {
        'column-1': [],
        'column-2': [],
        'column-3': [],
        'column-4': [],
        'column-5': [],
      };

      Object.values(taskPageData.tasks).forEach(task => {
        if (task.backendData) {
          const columnId = getColumnIdFromStatus(task.backendData.status_key);
          columnTasks[columnId].push(task.id);
        }
      });

      setData(prevData => ({
        tasks: taskPageData.tasks,
        columns: {
          'column-1': { ...prevData.columns['column-1'], taskIds: columnTasks['column-1'] },
          'column-2': { ...prevData.columns['column-2'], taskIds: columnTasks['column-2'] },
          'column-3': { ...prevData.columns['column-3'], taskIds: columnTasks['column-3'] },
          'column-4': { ...prevData.columns['column-4'], taskIds: columnTasks['column-4'] },
          'column-5': { ...prevData.columns['column-5'], taskIds: columnTasks['column-5'] },
        },
        columnOrder: prevData.columnOrder,
        users: taskPageData.users,
      }));
    }
  }, [taskPageData]);

  useEffect(() => {
    if (currentUser && taskPageData === null) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, projectId, currentProject?.id]);

  const handleTaskClick = (task: UITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleCreateTask = (columnId: string, statusKey: string) => {
    setCreateTaskStatusKey(statusKey);
    setIsCreateModalOpen(true);
  };

  const handleTaskCreated = async () => {
    await fetchTasks();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    await moveTask(taskId, newColumnId);
  };

  const moveTask = async (taskId: string, newColumnId: string) => {
    const task = data.tasks[taskId];
    if (!task || !task.backendData) return;

    const currentColumnId = getColumnIdFromStatus(task.backendData.status_key);
    if (currentColumnId === newColumnId) {
      return;
    }

    const newStatusKey = STATUS_MAP[newColumnId];
    const taskNumberId = parseInt(taskId.replace('task-', ''));

    try {
      // Optimistically update UI
      const currentColumn = data.columns[currentColumnId];
      const newColumn = data.columns[newColumnId];
      const newCurrentTaskIds = currentColumn.taskIds.filter(id => id !== taskId);
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
        tasks: {
          ...prevData.tasks,
          [taskId]: {
            ...task,
            status: STATUS_DISPLAY_MAP[newStatusKey] || 'To Do',
          },
        },
      }));

      // Update backend
      await updateTask(taskNumberId, {
        status_key: newStatusKey,
      });

      // Refresh to get latest data
      await fetchTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert on error
      await fetchTasks();
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <h3 className="text-danger mb-2">Error Loading Tasks</h3>
            <p className="text-secondary">{error}</p>
            <button className="btn btn-primary mt-3" onClick={fetchTasks}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb bg-white px-3 py-2 border-bottom d-flex align-items-center gap-2 small text-secondary">
        <span className="cursor-pointer">←</span>
        <span className="text-primary text-decoration-none cursor-pointer">Team spaces</span>
        <span>›</span>
        <span>Tasks</span>
      </div>
      
      <HeaderComponent projectId={projectId ? parseInt(projectId) : currentProject?.id} />
      <BoardComponent 
        data={data} 
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTask}
      />
      
      <TaskDetailsModal
        task={selectedTask}
        users={data.users}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTaskDeleted={fetchTasks}
        onTaskEdit={(task) => {
          if (task.backendData) {
            setTaskToEdit(task.backendData);
            setIsCreateModalOpen(true);
            setIsModalOpen(false);
          }
        }}
      />
      
      <TaskCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTaskToEdit(null);
        }}
        onCreated={handleTaskCreated}
        onUpdated={handleTaskCreated}
        defaultStatusKey={createTaskStatusKey}
        defaultProjectId={projectId ? parseInt(projectId) : currentProject?.id}
        task={taskToEdit}
      />
    </div>
  );
};

export default TasksPage;
