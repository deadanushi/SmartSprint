import { useState, useCallback } from 'react';
import { getTasks, getTaskStatuses, getTaskPriorities, getTaskTypes } from '../services/taskService';
import { useTaskOperations } from './useTaskOperations';
import type { TaskDto, TaskStatusOption, TaskPriorityOption, TaskTypeOption } from '../services/taskService';

export interface BacklogTask {
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
  backendData?: TaskDto;
}

interface UseBacklogDataOptions {
  projectId?: number;
  enabled?: boolean;
}

interface UseBacklogDataReturn {
  tasks: BacklogTask[];
  statusOptions: TaskStatusOption[];
  priorityOptions: TaskPriorityOption[];
  typeOptions: TaskTypeOption[];
  loading: boolean;
  loadingOptions: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refetchOptions: () => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  deleting: boolean;
}

// Priority display mapping
const PRIORITY_DISPLAY_MAP: { [key: string]: string } = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High',
};

// Convert backend task to backlog format
const convertToBacklogTask = (taskDto: TaskDto): BacklogTask => {
  const dueDate = taskDto.due_date 
    ? new Date(taskDto.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'No due date';

  const status = taskDto.status_name || 'To Do';
  const priority = PRIORITY_DISPLAY_MAP[taskDto.priority_key || 'medium'] || 'Medium';
  
  return {
    id: `task-${taskDto.id}`,
    title: taskDto.title,
    description: taskDto.description || '',
    status,
    priority,
    dueDate,
    assignees: taskDto.assignees.map(a => `user-${a.user_id}`),
    comments: taskDto.comments_count,
    links: taskDto.links_count,
    progress: `${taskDto.progress_percentage}%`,
    type: taskDto.task_type_key || 'backend',
    createdAt: taskDto.created_at,
    estimatedHours: taskDto.estimated_hours || 0,
    tags: [], // Tags not yet implemented in backend
    backendData: taskDto,
  };
};

/**
 * Custom hook for BacklogPage that aggregates task data and lookup options
 * Reduces coupling by encapsulating multiple service calls
 */
export const useBacklogData = (
  options: UseBacklogDataOptions = {}
): UseBacklogDataReturn => {
  const { projectId, enabled = true } = options;
  const [tasks, setTasks] = useState<BacklogTask[]>([]);
  const [statusOptions, setStatusOptions] = useState<TaskStatusOption[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<TaskPriorityOption[]>([]);
  const [typeOptions, setTypeOptions] = useState<TaskTypeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { deleteTask: deleteTaskOp, loading: deleting } = useTaskOperations();

  const refetchOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      const [statuses, priorities, types] = await Promise.all([
        getTaskStatuses(),
        getTaskPriorities(),
        getTaskTypes(),
      ]);
      setStatusOptions(statuses);
      setPriorityOptions(priorities);
      setTypeOptions(types);
    } catch (err) {
      console.error('Error fetching lookup options:', err);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const tasksList = await getTasks({
        project_id: projectId || undefined,
        limit: 1000,
      });

      const backlogTasks = tasksList.map(convertToBacklogTask);
      setTasks(backlogTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, enabled]);

  const handleDeleteTask = useCallback(async (taskId: number) => {
    await deleteTaskOp(taskId);
    await refetch();
  }, [deleteTaskOp, refetch]);

  return {
    tasks,
    statusOptions,
    priorityOptions,
    typeOptions,
    loading,
    loadingOptions,
    error,
    refetch,
    refetchOptions,
    deleteTask: handleDeleteTask,
    deleting,
  };
};

