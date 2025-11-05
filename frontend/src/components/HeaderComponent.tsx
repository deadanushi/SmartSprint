import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import type { UserDetailDto } from '../services/userService';
import AlertModal from './AlertModal';

interface HeaderComponentProps {
  projectId?: number;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ projectId }) => {
  const { users, loading } = useUsers({ is_active: true, limit: 20 });
  const [showAlert, setShowAlert] = useState(false);

  const handleButtonClick = () => {
    setShowAlert(true);
  };

  const getUserInitials = (user: UserDetailDto): string => {
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const displayedUsers = users.slice(0, 4);
  const remainingCount = users.length > 4 ? users.length - 4 : 0;

  return (
    <>
      <div className="bg-white px-3 py-2 border-bottom shadow-sm">
        <div className="d-flex justify-content-between align-items-start mb-3" style={{ maxWidth: '1400px', margin: '0 auto 16px auto' }}>
          <div className="flex-grow-1">
            <h1 className="h4 fw-bold text-dark mb-1">Tasks</h1>
            <p className="text-secondary mb-0 small">Keep track of your team's tasks all in one place.</p>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            {loading ? (
              <div className="d-flex align-items-center" style={{ minWidth: '120px' }}>
                <div className="spinner-border spinner-border-sm text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : users.length > 0 ? (
              <div className="d-flex align-items-center">
                {displayedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="member-avatar-small"
                    title={`${user.first_name} ${user.last_name}`}
                    style={{ cursor: 'pointer' }}
                    onClick={handleButtonClick}
                  >
                    {getUserInitials(user)}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div
                    className="member-count-avatar"
                    title={`${remainingCount} more member${remainingCount > 1 ? 's' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={handleButtonClick}
                  >
                    +{remainingCount}
                  </div>
                )}
              </div>
            ) : null}
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              onClick={handleButtonClick}
              style={{ cursor: 'pointer' }}
            >
              <span>👤</span>
              Invite Member
            </button>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={handleButtonClick}
              style={{ cursor: 'pointer' }}
            >
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

    <AlertModal
      open={showAlert}
      onClose={() => setShowAlert(false)}
      title="New Feature Coming Soon"
      message="This feature is currently under development and will be available soon!"
      variant="warning"
    />
    </>
  );
};

export default HeaderComponent;
