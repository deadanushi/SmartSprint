import { useState, useCallback } from 'react';
import { getTasks } from '../services/taskService';
import { getUsers } from '../services/userService';
import type { TaskDto } from '../services/taskService';
import type { UITask, UIUser } from '../types/ui';

interface TaskPageData {
  tasks: { [key: string]: UITask };
  users: { [key: string]: UIUser };
}

interface UseTaskPageDataOptions {
  projectId?: number;
  enabled?: boolean;
}

interface UseTaskPageDataReturn {
  data: TaskPageData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for TasksPage that aggregates task and user data
 * Reduces coupling by encapsulating multiple service calls
 */
export const useTaskPageData = (
  options: UseTaskPageDataOptions = {}
): UseTaskPageDataReturn => {
  const { projectId, enabled = true } = options;
  const [data, setData] = useState<TaskPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status mapping: column id -> backend status key
  const STATUS_DISPLAY_MAP: { [key: string]: string } = {
    'to-do': 'To Do',
    'in-progress': 'In Progress',
    'waiting-review': 'Waiting Review',
    'testing': 'Testing',
    'done': 'Done',
  };

  const PRIORITY_DISPLAY_MAP: { [key: string]: string } = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
  };

  // Convert backend task to frontend format
  const convertTask = (taskDto: TaskDto, users: { [key: string]: UIUser }): UITask => {
    const assigneeIds: string[] = taskDto.assignees.map(assignee => {
      const userId = `user-${assignee.user_id}`;
      if (!users[userId]) {
        users[userId] = {
          id: userId,
          name: assignee.user_name || 'Unknown',
          avatar: assignee.user_name 
            ? assignee.user_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'U'
        };
      }
      return userId;
    });

    const dueDate = taskDto.due_date 
      ? new Date(taskDto.due_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'No due date';

    const completed = Math.floor(taskDto.progress_percentage / 20);
    const total = 5;
    const progress = `${completed}/${total}`;

    return {
      id: `task-${taskDto.id}`,
      title: taskDto.title,
      description: taskDto.description || '',
      status: STATUS_DISPLAY_MAP[taskDto.status_key || 'to-do'] || 'To Do',
      priority: PRIORITY_DISPLAY_MAP[taskDto.priority_key || 'medium'] || 'Medium',
      dueDate,
      assignees: assigneeIds,
      comments: taskDto.comments_count,
      links: taskDto.links_count,
      progress,
      type: taskDto.task_type_key || 'backend',
      backendData: taskDto,
    };
  };

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch users first
      const usersList = await getUsers({ limit: 100 });
      const usersMap: { [key: string]: UIUser } = {};
      usersList.forEach(user => {
        const userId = `user-${user.id}`;
        usersMap[userId] = {
          id: userId,
          name: `${user.first_name} ${user.last_name}`,
          avatar: `${user.first_name[0]}${user.last_name[0]}`.toUpperCase(),
        };
      });

      // Fetch tasks
      const tasksList = await getTasks({
        project_id: projectId || undefined,
        limit: 1000,
      });

      // Convert tasks
      const tasksMap: { [key: string]: UITask } = {};
      tasksList.forEach(taskDto => {
        const task = convertTask(taskDto, usersMap);
        tasksMap[task.id] = task;
      });

      setData({
        tasks: tasksMap,
        users: usersMap,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      console.error('Error fetching task page data:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId, enabled]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

