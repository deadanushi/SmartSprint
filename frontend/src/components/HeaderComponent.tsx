import React from 'react';

const HeaderComponent: React.FC = () => {
  const headerStyles: React.CSSProperties = {
    background: '#FFFFFF',
    padding: '16px 24px',
    borderBottom: '1px solid #F4F6F8',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const headerContentStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    maxWidth: '1400px',
    margin: '0 auto 16px auto',
  };

  const headerLeftStyles: React.CSSProperties = {
    flex: 1,
  };

  const headerTitleStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0D0D0D',
    margin: '0 0 4px 0',
  };

  const headerSubtitleStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0',
    fontWeight: '400',
  };

  const headerRightStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const teamMembersStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '-6px',
  };

  const memberAvatarStyles: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#0056D2',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    marginLeft: '-6px',
    border: '2px solid white',
    boxShadow: '0 1px 4px rgba(0, 86, 210, 0.2)',
  };

  const memberCountStyles: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#F4F6F8',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    marginLeft: '-6px',
    border: '2px solid white',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  };

  const inviteBtnStyles: React.CSSProperties = {
    background: '#0056D2',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 4px rgba(0, 86, 210, 0.3)',
    transition: 'all 0.3s ease',
  };

  const shareBtnStyles: React.CSSProperties = {
    background: 'white',
    color: '#6B7280',
    border: '1px solid #F4F6F8',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  const navigationStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const boardControlsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
  };

  const controlItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={headerStyles}>
      <div style={headerContentStyles}>
        <div style={headerLeftStyles}>
          <h1 style={headerTitleStyles}>Tasks</h1>
          <p style={headerSubtitleStyles}>Keep track of your team's tasks all in one place.</p>
        </div>
        
        <div style={headerRightStyles}>
          <div style={teamMembersStyles}>
            <div style={memberAvatarStyles}>JD</div>
            <div style={memberAvatarStyles}>JS</div>
            <div style={memberAvatarStyles}>MJ</div>
            <div style={memberAvatarStyles}>SW</div>
            <div style={memberCountStyles}>+2</div>
          </div>
          <button 
            style={inviteBtnStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4DA3FF';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0056D2';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>👤</span>
            Invite Member
          </button>
          <button 
            style={shareBtnStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F4F6F8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>link</span>
            Share
          </button>
        </div>
      </div>
      
      <div style={navigationStyles}>
        <div style={boardControlsStyles}>
          <div 
            style={controlItemStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F4F6F8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>filter_list</span>
            Filter
          </div>
          <div 
            style={controlItemStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F4F6F8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>📚</span>
            Group by
          </div>
          <div 
            style={controlItemStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F4F6F8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>↕</span>
            Sort
          </div>
          <div 
            style={controlItemStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F4F6F8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span>⋯</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;