import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useProjects } from '../contexts/ProjectContext';
import { Link } from 'react-router-dom';
import { useBacklogData } from '../hooks/useBacklogData';
import type { BacklogTask } from '../hooks/useBacklogData';
import type { TaskDto } from '../services/taskService';
import AlertModal from '../components/AlertModal';
import TaskCreationModal from '../components/TaskCreationModal';

const BacklogPage: React.FC = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const { hasPermission } = useUser();
  const { currentProject } = useProjects();
  
  // Determine project ID
  const targetProjectId = projectId ? parseInt(projectId) : currentProject?.id;
  
  // Use custom hook to aggregate backlog data
  const {
    tasks,
    statusOptions,
    priorityOptions,
    typeOptions,
    loading,
    loadingOptions,
    error,
    refetch: fetchTasks,
    refetchOptions: fetchLookupOptions,
    deleteTask: handleDeleteTask,
    deleting,
  } = useBacklogData({
    projectId: targetProjectId,
    enabled: hasPermission('canViewProjectOverview'),
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTypes, setFilterTypes] = useState<string[]>([]); // Multiple selection for types
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<BacklogTask | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<TaskDto | null>(null);

  useEffect(() => {
    fetchLookupOptions();
  }, [fetchLookupOptions]);

  useEffect(() => {
    if (hasPermission('canViewProjectOverview')) {
      fetchTasks();
    }
  }, [hasPermission, fetchTasks]);

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  const handleTaskCreated = async () => {
    await fetchTasks();
  };

  const handleDeleteClick = (task: BacklogTask) => {
    setTaskToDelete(task);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete?.backendData) return;
    
    try {
      await handleDeleteTask(taskToDelete.backendData.id);
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setShowAlert(true);
    }
  };

  if (!hasPermission('canViewProjectOverview')) {
    return (
      <div className="page-container">
        <div className="p-4">
          <div className="bg-white rounded-3 p-5 text-center shadow-sm">
            <span className="material-icons d-block mb-3" style={{ fontSize: '64px', color: '#6B7280' }}>lock</span>
            <h1 className="h4 fw-semibold text-dark mb-2">Access Denied</h1>
            <p className="text-secondary mb-0">
              Only Project Managers can access the Backlog view.
            </p>
          </div>
        </div>
      </div>
    );
  }

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

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'frontend': return '#3b82f6';
      case 'backend': return '#8b5cf6';
      case 'design': return '#f97316';
      case 'test': return '#10b981';
      case 'devops': return '#ef4444';
      case 'data': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  const getTypeBgColor = (type: string): string => {
    switch (type) {
      case 'frontend': return '#eff6ff';
      case 'backend': return '#eef2ff';
      case 'design': return '#fff7ed';
      case 'test': return '#ecfdf5';
      case 'devops': return '#fef2f2';
      case 'data': return '#ecfeff';
      default: return '#f9fafb';
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Status filter - match by display name
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    // Priority filter - match by display name
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    // Type filter - multiple selection, match by key
    const matchesType = filterTypes.length === 0 || filterTypes.includes(task.type);
    
    // Search filter
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesStatus && matchesPriority && matchesType && matchesSearch;
  });
  
  const handleTypeToggle = (typeKey: string) => {
    setFilterTypes(prev => 
      prev.includes(typeKey)
        ? prev.filter(key => key !== typeKey)
        : [...prev, typeKey]
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-secondary">Loading backlog tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && tasks.length === 0) {
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

  const handleTaskClick = (task: BacklogTask) => {
    console.log('Task clicked:', task);
  };

  const handleEditClick = (task: BacklogTask) => {
    if (task.backendData) {
      setTaskToEdit(task.backendData);
      setShowCreateModal(true);
    }
  };

  const handleTaskUpdated = async () => {
    await fetchTasks();
  };

  const handleMoveToSprint = (taskId: string) => {
    console.log('Move to sprint:', taskId);
  };

  return (
    <div className="page-container">
      <div className="breadcrumb bg-white px-3 py-2 border-bottom d-flex align-items-center gap-2 small text-secondary">
        <Link to="/" className="text-primary text-decoration-none cursor-pointer">Home</Link>
        <span>›</span>
        <span>Backlog</span>
      </div>

      <div className="bg-white rounded-3 p-4 m-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h1 className="display-6 fw-bold text-dark mb-2">Project Backlog</h1>
            <p className="fs-6 text-secondary mb-0">
              Manage and prioritize tasks for upcoming sprints. Only Project Managers can access this view.
            </p>
          </div>
          {hasPermission('canCreateTasks') && (
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleCreateTask}
              style={{ height: '40px' }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>add</span>
              <span>Add Task</span>
            </button>
          )}
        </div>
        
        <div className="d-flex gap-3 flex-wrap align-items-end mt-4">
          <div className="d-flex flex-column gap-1">
            <label className="small fw-semibold text-secondary text-uppercase">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: '200px' }}
            />
          </div>
          
          <div className="d-flex flex-column gap-1">
            <label className="small fw-semibold text-secondary text-uppercase">Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={loadingOptions}
              style={{ minWidth: '140px' }}
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.key} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="d-flex flex-column gap-1">
            <label className="small fw-semibold text-secondary text-uppercase">Priority</label>
            <select
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              disabled={loadingOptions}
              style={{ minWidth: '140px' }}
            >
              <option value="all">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority.key} value={priority.name}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="d-flex flex-column gap-1" style={{ minWidth: '200px' }}>
            <label className="small fw-semibold text-secondary text-uppercase mb-2">Type (Multiple)</label>
            <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto', background: '#F9FAFB' }}>
              {loadingOptions ? (
                <p className="text-secondary small mb-0">Loading...</p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {typeOptions.map(type => (
                    <div key={type.key} className="d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        id={`filter-type-${type.key}`}
                        checked={filterTypes.includes(type.key)}
                        onChange={() => handleTypeToggle(type.key)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label 
                        htmlFor={`filter-type-${type.key}`}
                        className="mb-0 small"
                        style={{ cursor: 'pointer', flex: 1 }}
                      >
                        {type.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {filterTypes.length > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary mt-2"
                onClick={() => setFilterTypes([])}
                style={{ fontSize: '12px' }}
              >
                Clear Types
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="row g-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="col-md-6 col-lg-4">
              <div
                className="backlog-task-card bg-white rounded-3 p-4 shadow-sm border cursor-pointer h-100"
                onClick={() => handleTaskClick(task)}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h6 fw-semibold text-dark mb-2">{task.title}</h3>
                  <div 
                    className="small fw-semibold rounded-pill px-2 py-1 text-uppercase"
                    style={{
                      color: getPriorityColor(task.priority),
                      backgroundColor: getPriorityBgColor(task.priority),
                    }}
                  >
                    {task.priority}
                  </div>
                </div>
                
                {task.description ? (
                  <p className="small text-secondary mb-3 backlog-task-description" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.5',
                    minHeight: '48px'
                  }}>
                    {task.description}
                  </p>
                ) : (
                  <p className="small text-secondary mb-3 backlog-task-description fst-italic" style={{ minHeight: '48px' }}>
                    No description provided
                  </p>
                )}
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <div 
                    className="small fw-medium rounded-pill px-2 py-1"
                    style={{
                      color: getTypeColor(task.type),
                      backgroundColor: getTypeBgColor(task.type),
                    }}
                  >
                    {task.type}
                  </div>
                  {task.tags && task.tags.length > 0 && task.tags.map(tag => (
                    <span key={tag} className="backlog-tag badge bg-primary">{tag}</span>
                  ))}
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="small text-secondary fw-medium">
                    <span className="material-icons align-middle" style={{ fontSize: '14px' }}>event</span>{' '}
                    Due: {task.dueDate}
                  </div>
                  <div className="small text-secondary fw-medium">
                    <span className="material-icons align-middle" style={{ fontSize: '14px' }}>access_time</span>{' '}
                    {task.estimatedHours}h
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div className="small text-muted">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  <div className="d-flex gap-2">
                    {hasPermission('canEditTasks') && (
                      <button
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(task);
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: '16px' }}>edit</span>
                        Edit
                      </button>
                    )}
                    {hasPermission('canDeleteTasks') && (
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(task);
                        }}
                      >
                        <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                        Delete
                      </button>
                    )}
                    {hasPermission('canCreateSprints') && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToSprint(task.id);
                        }}
                      >
                        Move to Sprint
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center p-5 text-secondary">
            <span className="material-icons d-block mb-3" style={{ fontSize: '48px' }}>inbox</span>
            <h3 className="h6 fw-semibold mb-2">No tasks found</h3>
            <p className="small mb-0">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <TaskCreationModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setTaskToEdit(null);
        }}
        onCreated={handleTaskCreated}
        onUpdated={handleTaskUpdated}
        defaultStatusKey="to-do"
        defaultProjectId={projectId ? parseInt(projectId) : currentProject?.id}
        task={taskToEdit}
      />

      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="Error"
        message={error || 'An error occurred'}
        variant="error"
      />

      <AlertModal
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        variant="error"
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default BacklogPage;
