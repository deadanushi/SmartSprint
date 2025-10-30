import React from 'react';
import { Link } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const barStyles: React.CSSProperties = {
    width: '100%',
    background: 'linear-gradient(90deg, #0043A0 0%, #0056D2 50%, #3B82F6 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  const innerStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    height: '84px',
  };

  const brandStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  const logoStyles: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.5)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(2px)',
  };

  const titleStyles: React.CSSProperties = {
    color: 'white',
    fontSize: '26px',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    margin: 0,
    textShadow: '0 1px 0 rgba(0,0,0,0.08)'
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const secondaryBtnStyles: React.CSSProperties = {
    color: 'white',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryBtnStyles: React.CSSProperties = {
    color: '#0B1324',
    background: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 900,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
  };

  return (
    <div style={barStyles}>
      <div style={innerStyles}>
        <div style={brandStyles}>
          <div style={logoStyles}>SS</div>
          <h1 style={titleStyles}>Smart Sprint</h1>
        </div>
        
        <div style={actionsStyles}>
          <Link to="/login"
            style={{ textDecoration: 'none' }}
          >
            <button
              style={secondaryBtnStyles}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              Log in
            </button>
          </Link>
          <Link to="/register"
            style={{ textDecoration: 'none' }}
          >
            <button
              style={primaryBtnStyles}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
