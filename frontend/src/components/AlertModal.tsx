import React from 'react';

export type AlertVariant = 'info' | 'success' | 'error' | 'warning';

interface AlertModalProps {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  variant?: AlertVariant;
  confirmText?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const variantStyles: Record<AlertVariant, { icon: string; color: string; bg: string; border: string }> = {
  info: { icon: 'info', color: '#0B3B8C', bg: '#EBF2FF', border: '#C7DBFF' },
  success: { icon: 'check_circle', color: '#0F766E', bg: '#ECFDF5', border: '#A7F3D0' },
  error: { icon: 'error', color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
  warning: { icon: 'warning', color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
};

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  title = 'Notification',
  message,
  variant = 'info',
  confirmText = 'OK',
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  const vs = variantStyles[variant];

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2, 6, 23, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '520px',
    background: '#FFFFFF',
    borderRadius: '14px',
    boxShadow: '0 16px 48px rgba(2, 6, 23, 0.24)',
    border: '1px solid #E5E7EB',
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '18px 20px 0 20px',
  };

  const iconStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: vs.bg,
    border: `1px solid ${vs.border}`,
    color: vs.color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyles: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
    color: '#0F172A',
  };

  const bodyStyles: React.CSSProperties = {
    padding: '12px 20px 0 20px',
    color: '#334155',
    fontSize: '14px',
  };

  const footerStyles: React.CSSProperties = {
    padding: '18px 20px 20px 20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  };

  const buttonBase: React.CSSProperties = {
    height: '40px',
    padding: '0 14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    border: '1px solid #E5E7EB',
    background: '#FFFFFF',
    color: '#0F172A',
  };

  const confirmStyles: React.CSSProperties = {
    ...buttonBase,
    background: '#0B1324',
    color: 'white',
    border: 'none',
  };

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyles}>
          <div style={iconStyles}>
            <span className="material-icons" style={{ fontSize: '20px', lineHeight: 0 }}>{variantStyles[variant].icon}</span>
          </div>
          <h3 style={titleStyles}>{title}</h3>
        </div>
        {message && (
          <div style={bodyStyles}>{message}</div>
        )}
        <div style={footerStyles}>
          <button style={buttonBase} onClick={onClose}>Close</button>
          <button style={confirmStyles} onClick={onConfirm || onClose}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;


