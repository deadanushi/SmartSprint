import React, { useState } from 'react';
import type { StepComponentProps } from '../types';

interface Step4ProfilePictureProps extends StepComponentProps {
  avatarPreview: string | null;
  onAvatarPreviewChange: (preview: string | null) => void;
  showError: (title: string, message: string, variant: 'error' | 'warning' | 'info') => void;
}

const Step4ProfilePicture: React.FC<Step4ProfilePictureProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  avatarPreview,
  onAvatarPreviewChange,
  showError,
}) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('File too large', 'Avatar image must be less than 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onAvatarPreviewChange(result);
        onInputChange('avatarUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarPreviewChange(null);
    onInputChange('avatarUrl', null);
  };

  return (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Profile Picture</h2>
      <p className="text-center mb-3" style={{ fontSize: '14px', color: '#6B7280' }}>Upload your avatar</p>
      <p className="text-center mb-4 small" style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
        Profile photo is not required - you can skip this step and add one later in your settings
      </p>
      
      <div className="text-center mb-4">
        {avatarPreview ? (
          <div className="position-relative d-inline-block">
            <img
              src={avatarPreview}
              alt="Avatar preview"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #0056D2'
              }}
            />
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="btn btn-sm position-absolute"
              style={{
                bottom: '0',
                right: '0',
                background: '#DC2626',
                color: 'white',
                border: '2px solid white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
            </button>
          </div>
        ) : (
          <div
            className="d-flex flex-column align-items-center justify-content-center border rounded"
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto',
              background: '#F9FAFB',
              borderColor: '#E5E7EB',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            <span className="material-icons mb-2" style={{ fontSize: '40px', color: '#9CA3AF' }}>add_a_photo</span>
            <span className="small" style={{ color: '#6B7280', fontSize: '12px' }}>Upload</span>
          </div>
        )}
        <input
          type="file"
          id="avatar-upload"
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
      </div>

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
          type="button"
          onClick={onNext}
          className="btn flex-fill fw-bold"
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
          {avatarPreview ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </>
  );
};

export default Step4ProfilePicture;

