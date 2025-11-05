import React, { useState } from 'react';
import { useProjects } from '../contexts/ProjectContext';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (projectId: number) => void;
}

const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newProject = await createProject(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
      onClose();
      if (onCreated) {
        onCreated(newProject.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }} 
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3 shadow-lg border w-100" 
        style={{ maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0 fw-bold" style={{ fontSize: '20px', color: '#0F172A' }}>
              Create New Project
            </h3>
            <button
              className="btn btn-link p-0"
              onClick={handleClose}
              disabled={loading}
              style={{ width: '32px', height: '32px', fontSize: '24px', color: '#64748B' }}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="project-name" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
              Project Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="project-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              disabled={loading}
              style={{ 
                height: '44px', 
                fontSize: '14px',
                border: error && !name.trim() ? '2px solid #DC2626' : '1px solid #CBD5E1',
                borderRadius: '8px'
              }}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label htmlFor="project-description" className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#334155' }}>
              Description <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 'normal' }}>(Optional)</span>
            </label>
            <textarea
              id="project-description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              disabled={loading}
              rows={4}
              style={{ 
                fontSize: '14px',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                resize: 'vertical'
              }}
            />
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
              disabled={loading}
              style={{ height: '40px', padding: '0 20px', fontSize: '14px', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-dark"
              disabled={loading || !name.trim()}
              style={{ height: '40px', padding: '0 20px', fontSize: '14px', fontWeight: 600 }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" style={{ width: '14px', height: '14px' }}></span>
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreationModal;

