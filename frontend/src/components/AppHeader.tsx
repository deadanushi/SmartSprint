import React from 'react';

const AppHeader: React.FC = () => {
  return (
    <div className="w-100 bg-primary" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="w-100 d-flex align-items-center justify-content-between px-4" style={{ height: '100px' }}>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center text-white fw-bold" style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            border: '2px solid rgba(255,255,255,0.95)' 
          }}>
            SS
          </div>
          <h1 className="text-white mb-0 fw-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            Smart Sprint
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
