import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '../services/taskService';
import type { TaskDto, TaskCreatePayload, TaskUpdatePayload } from '../services/taskService';

interface UseTaskOperationsReturn {
  createTask: (payload: TaskCreatePayload) => Promise<TaskDto>;
  updateTask: (taskId: number, payload: TaskUpdatePayload) => Promise<TaskDto>;
  deleteTask: (taskId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useTaskOperations = (): UseTaskOperationsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (payload: TaskCreatePayload): Promise<TaskDto> => {
    try {
      setLoading(true);
      setError(null);
      const task = await createTask(payload);
      return task;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (taskId: number, payload: TaskUpdatePayload): Promise<TaskDto> => {
    try {
      setLoading(true);
      setError(null);
      const task = await updateTask(taskId, payload);
      return task;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask: handleCreate,
    updateTask: handleUpdate,
    deleteTask: handleDelete,
    loading,
    error,
  };
};

