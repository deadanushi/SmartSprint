import React from 'react';
import clsx from 'clsx';

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

  return (
    <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'rgba(2, 6, 23, 0.45)', zIndex: 1000 }} 
         onClick={onClose}>
      <div className="modal-content bg-white rounded-3 shadow-lg border w-100" 
           style={{ maxWidth: '520px' }} 
           onClick={(e) => e.stopPropagation()}>
        <div className="d-flex align-items-center gap-3 p-4 pb-0">
          <div className="d-flex align-items-center justify-content-center rounded" 
               style={{ 
                 width: '36px', 
                 height: '36px', 
                 background: vs.bg, 
                 border: `1px solid ${vs.border}`, 
                 color: vs.color 
               }}>
            <span className="material-icons" style={{ fontSize: '20px', lineHeight: 0 }}>
              {vs.icon}
            </span>
          </div>
          <h3 className="mb-0 fw-bold" style={{ fontSize: '18px', color: '#0F172A' }}>{title}</h3>
        </div>
        {message && (
          <div className="px-4 pt-3" style={{ color: '#334155', fontSize: '14px' }}>
            {message}
          </div>
        )}
        <div className="d-flex justify-content-end gap-2 p-4">
          <button 
            className="btn btn-outline-secondary rounded" 
            style={{ height: '40px', padding: '0 14px', fontSize: '14px', fontWeight: 700 }}
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="btn btn-dark rounded" 
            style={{ height: '40px', padding: '0 14px', fontSize: '14px', fontWeight: 700 }}
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
