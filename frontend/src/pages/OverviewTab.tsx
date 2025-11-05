import React from 'react';
import type { ProjectDto } from '../services/projectService';

interface OverviewTabProps {
  project: ProjectDto;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ project }) => {
  return (
    <div>
      <h3 className="mb-4" style={{ fontSize: '20px', color: '#0F172A' }}>Project Overview</h3>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="bg-white rounded-3 p-4 border shadow-sm">
            <h5 className="mb-3" style={{ fontSize: '16px', color: '#334155' }}>Project Details</h5>
            <div className="d-flex flex-column gap-3">
              <div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Status</span>
                <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#0F172A' }}>
                  {project.status_name || 'Not Set'}
                </p>
              </div>
              {project.project_manager_name && (
                <div>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>Project Manager</span>
                  <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#0F172A' }}>
                    {project.project_manager_name}
                  </p>
                </div>
              )}
              {project.company_name && (
                <div>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>Company</span>
                  <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#0F172A' }}>
                    {project.company_name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-white rounded-3 p-4 border shadow-sm">
            <h5 className="mb-3" style={{ fontSize: '16px', color: '#334155' }}>Statistics</h5>
            <div className="d-flex flex-column gap-3">
              <div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Total Tasks</span>
                <p className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#3B82F6' }}>
                  {project.tasks_count}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Sprints</span>
                <p className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#10B981' }}>
                  {project.sprints_count}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Team Members</span>
                <p className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#F59E0B' }}>
                  {project.members_count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

