import React from 'react';

const AppHeader: React.FC = () => {
  const barStyles: React.CSSProperties = {
    width: '100%',
    background: '#0056D2',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
  };

  const innerStyles: React.CSSProperties = {
    width: '100%',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 32px', 
    height: '100px',
  };

  const brandStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  const logoStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'transparent',
    border: '2px solid rgba(255,255,255,0.95)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: '16px',
  };

  const titleStyles: React.CSSProperties = {
    color: 'white',
    fontSize: '28px',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    margin: 0,
  };

  return (
    <div style={barStyles}>
      <div style={innerStyles}>
        <div style={brandStyles}>
          <div style={logoStyles}>SS</div>
          <h1 style={titleStyles}>Smart Sprint</h1>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
