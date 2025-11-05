import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useProjects } from '../contexts/ProjectContext';
import { useTaskOperations } from '../hooks/useTaskOperations';
import { useUsers } from '../hooks/useUsers';
import type { TaskDto } from '../services/taskService';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  onUpdated?: () => void;
  defaultStatusKey?: string;
  defaultProjectId?: number;
  task?: TaskDto | null;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  defaultStatusKey = 'to-do',
  defaultProjectId,
  task = null,
}) => {
  const isEditMode = !!task;
  const { currentUser } = useUser();
  const { currentProject } = useProjects();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusKey, setStatusKey] = useState(defaultStatusKey);
  const [priorityKey, setPriorityKey] = useState('medium');
  const [taskTypeKey, setTaskTypeKey] = useState('backend');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number | null>(null);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use custom hooks for operations
  const { createTask: createTaskOp, updateTask: updateTaskOp, loading: operationsLoading } = useTaskOperations();
  const { users: availableUsers } = useUsers({ is_active: true, limit: 100, enabled: isOpen });

  useEffect(() => {
    if (isOpen && task && isEditMode) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatusKey(task.status_key || 'to-do');
      setPriorityKey(task.priority_key || 'medium');
      setTaskTypeKey(task.task_type_key || 'backend');
      setDueDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
      setEstimatedHours(task.estimated_hours || null);
      setSelectedAssigneeIds(task.assignees.map(a => a.user_id));
      setError(null);
    }
  }, [isOpen, task, isEditMode]);

  useEffect(() => {
    if (!isOpen && !isEditMode) {
      setTitle('');
      setDescription('');
      setStatusKey(defaultStatusKey);
      setPriorityKey('medium');
      setTaskTypeKey('backend');
      setDueDate('');
      setEstimatedHours(null);
      setSelectedAssigneeIds([]);
      setError(null);
    } else if (isOpen && !isEditMode) {
      setStatusKey(defaultStatusKey);
    }
  }, [isOpen, defaultStatusKey, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (isEditMode && !task) return;

    setError(null);

    try {
      const dueDateValue = dueDate ? new Date(dueDate).toISOString() : null;

      if (isEditMode && task) {
        // Update existing task
        await updateTaskOp(task.id, {
          title: title.trim(),
          description: description.trim() || null,
          status_key: statusKey,
          priority_key: priorityKey,
          task_type_key: taskTypeKey,
          assignee_ids: selectedAssigneeIds,
          due_date: dueDateValue,
          estimated_hours: estimatedHours || null,
        });
        
        onClose();
        if (onUpdated) {
          onUpdated();
        }
      } else {
        const projectId = defaultProjectId || currentProject?.id || null;
        const currentUserId = currentUser?.id ? parseInt(currentUser.id, 10) : null;

        await createTaskOp({
          title: title.trim(),
          description: description.trim() || null,
          project_id: projectId,
          status_key: statusKey,
          priority_key: priorityKey,
          task_type_key: taskTypeKey,
          assignee_ids: selectedAssigneeIds,
          created_by: currentUserId,
          due_date: dueDateValue,
          estimated_hours: estimatedHours || null,
          progress_percentage: 0,
        });
        
        setTitle('');
        setDescription('');
        setStatusKey(defaultStatusKey);
        setPriorityKey('medium');
        setTaskTypeKey('backend');
        setDueDate('');
        setEstimatedHours(null);
        setSelectedAssigneeIds([]);
        onClose();
        if (onCreated) {
          onCreated();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isEditMode ? 'Failed to update task' : 'Failed to create task'));
    }
  };

  const handleClose = () => {
    if (!operationsLoading) {
      if (!isEditMode) {
        setTitle('');
        setDescription('');
        setStatusKey(defaultStatusKey);
        setPriorityKey('medium');
        setTaskTypeKey('backend');
        setDueDate('');
        setEstimatedHours(null);
        setSelectedAssigneeIds([]);
      }
      setError(null);
      onClose();
    }
  };

  const toggleAssignee = (userId: number) => {
    setSelectedAssigneeIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (!isOpen) return null;
  if (isEditMode && !task) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} 
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3 shadow-lg border w-100" 
        style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0 fw-bold" style={{ fontSize: '20px', color: '#0F172A' }}>
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button
              className="btn btn-link p-0"
              onClick={handleClose}
              disabled={operationsLoading}
              style={{ width: '32px', height: '32px', fontSize: '24px', color: '#64748B' }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label htmlFor={`task-title-${isEditMode ? 'edit' : 'create'}`} className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
              Title <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id={`task-title-${isEditMode ? 'edit' : 'create'}`}
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              disabled={operationsLoading}
              style={{ 
                height: '44px', 
                fontSize: '14px',
                border: error && !title.trim() ? '2px solid #DC2626' : '1px solid #CBD5E1',
                borderRadius: '8px'
              }}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor={`task-description-${isEditMode ? 'edit' : 'create'}`} className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
              Description <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>(Optional)</span>
            </label>
            <textarea
              id={`task-description-${isEditMode ? 'edit' : 'create'}`}
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              disabled={operationsLoading}
              rows={4}
              style={{ 
                fontSize: '14px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="task-status" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
                Status
              </label>
              <select
                id="task-status"
                className="form-select"
                value={statusKey}
                onChange={(e) => setStatusKey(e.target.value)}
                disabled={operationsLoading}
                style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="waiting-review">Waiting Review</option>
                <option value="testing">Testing</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="task-priority" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
                Priority
              </label>
              <select
                id="task-priority"
                className="form-select"
                value={priorityKey}
                onChange={(e) => setPriorityKey(e.target.value)}
                disabled={operationsLoading}
                style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label htmlFor="task-type" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
                Type
              </label>
              <select
                id="task-type"
                className="form-select"
                value={taskTypeKey}
                onChange={(e) => setTaskTypeKey(e.target.value)}
                disabled={operationsLoading}
                style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="design">Design</option>
                <option value="test">Test</option>
                <option value="devops">DevOps</option>
                <option value="data">Data</option>
                <option value="product">Product</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="task-duedate" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
                Due Date <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>(Optional)</span>
              </label>
              <input
                id="task-duedate"
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={operationsLoading}
                style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="task-hours" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
              Estimated Hours <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>(Optional)</span>
            </label>
            <input
              id="task-hours"
              type="number"
              className="form-control"
              value={estimatedHours || ''}
              onChange={(e) => setEstimatedHours(e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="0.0"
              min="0"
              step="0.5"
              disabled={operationsLoading}
              style={{ height: '44px', fontSize: '14px', borderRadius: '8px' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
              Assignees <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>(Optional)</span>
            </label>
            <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto', background: '#F9FAFB' }}>
              {availableUsers.length === 0 ? (
                <p className="text-secondary small mb-0">Loading users...</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {availableUsers.map(user => (
                    <div key={user.id} className="d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        id={`assignee-${isEditMode ? 'edit' : 'create'}-${user.id}`}
                        checked={selectedAssigneeIds.includes(user.id)}
                        onChange={() => toggleAssignee(user.id)}
                        disabled={operationsLoading}
                        style={{ cursor: 'pointer' }}
                      />
                      <label 
                        htmlFor={`assignee-${isEditMode ? 'edit' : 'create'}-${user.id}`}
                        className="mb-0 small"
                        style={{ cursor: 'pointer', flex: 1 }}
                      >
                        {user.first_name} {user.last_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mb-3" style={{ fontSize: '13px', padding: '10px 14px' }}>
              {error}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClose}
              disabled={operationsLoading}
              style={{ height: '40px', padding: '0 20px', fontSize: '14px', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={operationsLoading || !title.trim()}
              style={{ height: '40px', padding: '0 20px', fontSize: '14px', fontWeight: 600 }}
            >
              {operationsLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" style={{ width: '14px', height: '14px' }}></span>
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;

