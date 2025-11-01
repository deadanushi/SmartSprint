import React from 'react';
import { Link } from 'react-router-dom';
import type { StepComponentProps } from '../types';
import type { RoleDto } from '../../../services/api';

interface Step5TermsConfirmationProps extends StepComponentProps {
  roles: RoleDto[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const Step5TermsConfirmation: React.FC<Step5TermsConfirmationProps> = ({
  formData,
  onInputChange,
  onBack,
  showError,
  roles,
  isLoading,
  onSubmit,
}) => {
  const selectedRole = roles.find(r => r.role_key === formData.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      showError('Terms required', 'You must accept the Terms of Service to continue.', 'warning');
      return;
    }
    onSubmit(e);
  };

  return (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Terms & Confirmation</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Review your information and accept terms</p>
      
      <div className="mb-4 p-4 rounded border" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
        <h3 className="h6 fw-bold mb-3" style={{ color: '#111827' }}>Registration Summary</h3>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Name:</span>
            <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Email:</span>
            <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>{formData.email}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Company:</span>
            <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>{formData.companyName}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span style={{ color: '#6B7280', fontSize: '14px' }}>Role:</span>
            <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>
              {selectedRole?.name || 'Not selected'}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={(e) => onInputChange('acceptTerms', e.target.checked)}
            style={{ marginTop: '6px' }}
          />
          <label className="form-check-label" htmlFor="acceptTerms" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
            I accept the <Link to="/terms" target="_blank" style={{ color: '#0056D2' }}>Terms of Service</Link> and{' '}
            <Link to="/privacy" target="_blank" style={{ color: '#0056D2' }}>Privacy Policy</Link>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="emailNotifications"
            checked={formData.emailNotifications}
            onChange={(e) => onInputChange('emailNotifications', e.target.checked)}
            style={{ marginTop: '6px' }}
          />
          <label className="form-check-label" htmlFor="emailNotifications" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
            Send me email notifications about my account and tasks
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn flex-fill"
              style={{ 
                height: '46px',
                borderRadius: '8px',
                background: '#F3F4F6',
                color: '#374151',
                fontSize: '15px',
                border: '1px solid #E5E7EB',
                padding: '14px'
              }}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="btn flex-fill fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={!formData.acceptTerms || isLoading}
            style={{ 
              height: '46px',
              borderRadius: '8px',
              background: (formData.acceptTerms && !isLoading) ? '#0056D2' : '#9CA3AF',
              color: 'white',
              fontSize: '15px',
              border: 'none',
              padding: '14px',
              cursor: (formData.acceptTerms && !isLoading) ? 'pointer' : 'not-allowed'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Step5TermsConfirmation;

