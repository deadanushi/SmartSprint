import React from 'react';

const HeaderComponent: React.FC = () => {
  return (
    <div className="bg-white px-3 py-2 border-bottom shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-3" style={{ maxWidth: '1400px', margin: '0 auto 16px auto' }}>
        <div className="flex-grow-1">
          <h1 className="h4 fw-bold text-dark mb-1">Tasks</h1>
          <p className="text-secondary mb-0 small">Keep track of your team's tasks all in one place.</p>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center">
            <div className="member-avatar-small">JD</div>
            <div className="member-avatar-small">JS</div>
            <div className="member-avatar-small">MJ</div>
            <div className="member-avatar-small">SW</div>
            <div className="member-count-avatar">+2</div>
          </div>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
            <span>👤</span>
            Invite Member
          </button>
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <span className="material-icons" style={{ fontSize: '16px' }}>link</span>
            Share
          </button>
        </div>
      </div>
      
      <div className="d-flex justify-content-end" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center gap-2 px-2 py-2 rounded control-item">
            <span className="material-icons" style={{ fontSize: '16px' }}>filter_list</span>
            Filter
          </div>
          <div className="d-flex align-items-center gap-2 px-2 py-2 rounded control-item">
            <span>📚</span>
            Group by
          </div>
          <div className="d-flex align-items-center gap-2 px-2 py-2 rounded control-item">
            <span>↕</span>
            Sort
          </div>
          <div className="d-flex align-items-center gap-2 px-2 py-2 rounded control-item">
            <span>⋯</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
