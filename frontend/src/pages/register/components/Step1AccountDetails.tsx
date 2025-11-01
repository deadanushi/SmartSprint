import React, { useState } from 'react';
import type { StepComponentProps } from '../types';

const Step1AccountDetails: React.FC<StepComponentProps> = ({ formData, onInputChange, onNext, showError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasswordStrength = (password: string): { valid: boolean; message: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    return { valid: true, message: '' };
  };

  const handleContinue = () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      showError('Missing information', 'Please fill out all fields to continue.', 'warning');
      return;
    }
    if (!validateEmail(formData.email)) {
      showError('Invalid email', 'Please enter a valid email address.', 'error');
      return;
    }
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.valid) {
      showError('Weak password', passwordValidation.message, 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match', 'Please make sure both password fields are identical.', 'error');
      return;
    }
    onNext();
  };

  return (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Account Details</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Let's get started with your basic information</p>
      
      <div className="d-flex flex-column gap-3">
        <div>
          <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Full Name</label>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                value={formData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                placeholder="First name"
                required
                style={{ 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  padding: '12px 16px',
                  background: '#FAFBFC'
                }}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                value={formData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                placeholder="Last name"
                required
                style={{ 
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px',
                  padding: '12px 16px',
                  background: '#FAFBFC'
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Email address</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter your email"
            required
            style={{ 
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              padding: '12px 16px',
              background: '#FAFBFC'
            }}
          />
        </div>

        <div>
          <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              placeholder="Create a password (min 8 chars, uppercase, lowercase, number)"
              required
              style={{ 
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                padding: '12px 16px',
                paddingRight: '45px',
                background: '#FAFBFC'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-link position-absolute"
              style={{
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                padding: 0,
                color: '#6B7280'
              }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Confirm password</label>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
              style={{ 
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                padding: '12px 16px',
                paddingRight: '45px',
                background: '#FAFBFC'
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="btn btn-link position-absolute"
              style={{
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                padding: 0,
                color: '#6B7280'
              }}
            >
              <span className="material-icons" style={{ fontSize: '20px' }}>
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="btn w-100 mt-2 fw-bold d-flex align-items-center justify-content-center"
          style={{ 
            height: '46px',
            borderRadius: '8px',
            background: '#0056D2',
            color: 'white',
            fontSize: '15px',
            border: 'none',
            padding: '14px'
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default Step1AccountDetails;

