import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTaskOperations } from '../hooks/useTaskOperations';
import type { TaskDto } from '../services/taskService';
import type { UITask, UIUser } from '../types/ui';
import AlertModal from './AlertModal';

interface TaskDetailsModalProps {
  task: UITask | null;
  users: { [key: string]: UIUser };
  isOpen: boolean;
  onClose: () => void;
  onTaskDeleted?: () => void;
  onTaskEdit?: (task: UITask) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ 
  task, 
  users, 
  isOpen, 
  onClose, 
  onTaskDeleted,
  onTaskEdit 
}) => {
  const { hasPermission } = useUser();
  const { deleteTask: deleteTaskOp, loading: deleting } = useTaskOperations();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    if (!task.backendData) return;
    
    try {
      await deleteTaskOp(task.backendData.id);
      setShowDeleteConfirm(false);
      onClose();
      if (onTaskDeleted) {
        onTaskDeleted();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Error is already handled by the hook
    }
  };

  const handleEdit = () => {
    if (onTaskEdit) {
      onTaskEdit(task);
    }
  };

  const canDelete = hasPermission('canDeleteTasks');
  const canEdit = hasPermission('canEditTasks');

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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'To Do': return '#6b7280';
      case 'In Progress': return '#3b82f6';
      case 'Waiting Review': return '#8b5cf6';
      case 'Testing': return '#f97316';
      case 'Done': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case 'To Do': return '#f9fafb';
      case 'In Progress': return '#eff6ff';
      case 'Waiting Review': return '#f3e8ff';
      case 'Testing': return '#fff7ed';
      case 'Done': return '#ecfdf5';
      default: return '#f9fafb';
    }
  };

  const getAssignees = (): UIUser[] => {
    return task.assignees.map(userId => users[userId]).filter(Boolean);
  };

  const sampleComments = [
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      time: '2 hours ago',
      text: 'This task looks good to me. The implementation follows our coding standards.'
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: 'JS',
      time: '1 day ago',
      text: 'I\'ve reviewed the requirements and everything seems to be in order. Ready for testing.'
    }
  ];

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3 w-100 shadow-lg position-relative" 
        style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="position-absolute bg-light border-0 rounded p-2 d-flex align-items-center justify-content-center"
          style={{ top: '16px', right: '16px', width: '32px', height: '32px', fontSize: '18px', color: '#6B7280', zIndex: 10 }}
          onClick={onClose}
        >
          ×
        </button>

        <div className="p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <div 
                className="d-inline-block rounded-pill px-3 py-2 small fw-semibold text-uppercase mb-3"
                style={{
                  color: getStatusColor(task.status),
                  backgroundColor: getStatusBgColor(task.status),
                }}
              >
                {task.status}
              </div>
              <h1 className="display-6 fw-bold text-dark mb-3">{task.title}</h1>
            </div>
            <div className="d-flex gap-2 ms-3">
              {canEdit && (
                <button
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                  onClick={handleEdit}
                  style={{ height: '36px', fontSize: '13px' }}
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ height: '36px', fontSize: '13px' }}
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>delete</span>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-4 p-4">
          <div className="flex-grow-1">
            <div className="mb-4">
              <h3 className="small fw-semibold text-dark text-uppercase mb-3">Description</h3>
              <div className="bg-light rounded-3 p-3 border">
                {task.description ? (
                  <p className="text-body mb-0" style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {task.description}
                  </p>
                ) : (
                  <p className="text-secondary mb-0 fst-italic" style={{ fontSize: '14px' }}>
                    No description provided
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="small fw-semibold text-dark text-uppercase mb-3">Comments</h3>
              <div className="task-modal-comments-section bg-light rounded-3 p-3 border">
                {hasPermission('canViewAllComments') && (
                  <>
                    {sampleComments.map(comment => (
                      <div key={comment.id} className="task-modal-comment bg-white rounded p-3 mb-3 border shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div className="task-modal-avatar-small">{comment.avatar}</div>
                          <span className="small fw-semibold text-dark">{comment.author}</span>
                          <span className="small text-secondary">{comment.time}</span>
                        </div>
                        <p className="small text-body mb-0">{comment.text}</p>
                      </div>
                    ))}
                  </>
                )}
                {hasPermission('canAddComments') && (
                  <div className="task-modal-comment bg-light border-2 border-dashed rounded p-3 text-center text-secondary fst-italic cursor-pointer">
                    Add a comment...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="task-modal-sidebar" style={{ width: '240px', flexShrink: 0 }}>
            <div className="task-modal-sidebar-section bg-light rounded p-3 mb-3 border">
              <h3 className="small fw-semibold text-dark text-uppercase mb-3">Priority & Status</h3>
              <div 
                className="d-inline-block rounded-pill px-3 py-2 small fw-semibold text-uppercase mb-2"
                style={{
                  color: getPriorityColor(task.priority),
                  backgroundColor: getPriorityBgColor(task.priority),
                }}
              >
                {task.priority}
              </div>
              <div className="d-block"></div>
              <div 
                className="d-inline-block rounded-pill px-3 py-2 small fw-semibold text-uppercase mb-2"
                style={{
                  color: getStatusColor(task.status),
                  backgroundColor: getStatusBgColor(task.status),
                }}
              >
                {task.status}
              </div>
            </div>

            <div className="task-modal-sidebar-section bg-light rounded p-3 mb-3 border">
              <h3 className="small fw-semibold text-dark text-uppercase mb-3">Due Date</h3>
              <div className="d-flex align-items-center gap-2 small text-secondary fw-medium mb-2">
                <span className="material-icons" style={{ fontSize: '16px' }}>event</span>
                {task.dueDate}
              </div>
            </div>

            <div className="task-modal-sidebar-section bg-light rounded p-3 mb-3 border">
              <h3 className="small fw-semibold text-dark text-uppercase mb-3">Team</h3>
              <div className="mb-3">
                <div className="small fw-semibold text-secondary mb-2">Assignees</div>
                <div className="d-flex flex-column gap-2">
                  {getAssignees().map(user => (
                    <div key={user.id} className="d-flex align-items-center gap-2 p-2 bg-white rounded border">
                      <div className="task-modal-avatar-small">{user.avatar}</div>
                      <span className="small fw-medium text-dark">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="small fw-semibold text-secondary mb-2">Reviewer</div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-center gap-2 p-2 bg-white rounded border">
                    <div className="task-modal-avatar-small">RS</div>
                    <span className="small fw-medium text-dark">Review Supervisor</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="task-modal-sidebar-section bg-light rounded p-3 border">
              <h3 className="small fw-semibold text-dark text-uppercase mb-3">Metrics</h3>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2 small text-secondary fw-medium p-2 bg-white rounded border">
                  <span className="material-icons" style={{ fontSize: '16px' }}>comment</span>
                  {task.comments} Comments
                </div>
                <div className="d-flex align-items-center gap-2 small text-secondary fw-medium p-2 bg-white rounded border">
                  <span className="material-icons" style={{ fontSize: '16px' }}>link</span>
                  {task.links} Links
                </div>
                <div className="d-flex align-items-center gap-2 small text-secondary fw-medium p-2 bg-white rounded border">
                  <span className="material-icons" style={{ fontSize: '16px' }}>assessment</span>
                  Progress: {task.progress}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        variant="error"
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default TaskDetailsModal;
