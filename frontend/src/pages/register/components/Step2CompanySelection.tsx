import React from 'react';
import type { StepComponentProps } from '../types';
import type { CompanyDto } from '../../../services/companyService';

interface Step2CompanySelectionProps extends StepComponentProps {
  companySearch: string;
  onCompanySearchChange: (value: string) => void;
  companies: CompanyDto[];
  isLoadingCompanies: boolean;
}

const Step2CompanySelection: React.FC<Step2CompanySelectionProps> = ({
  formData,
  onInputChange,
  onNext,
  onBack,
  showError,
  companySearch,
  onCompanySearchChange,
  companies,
  isLoadingCompanies,
}) => {
  const handleContinue = () => {
    if (!formData.companyId) {
      showError('Select a company', 'Please select a company to continue.', 'warning');
      return;
    }
    onNext();
  };

  return (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Company Selection</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Join an existing company or create a new one</p>
      
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control"
          value={companySearch}
          onChange={(e) => onCompanySearchChange(e.target.value)}
          placeholder="Search for your company..."
          disabled={isLoadingCompanies}
          style={{ 
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            padding: '12px 16px',
            background: '#FAFBFC'
          }}
        />
        {companySearch && (
          <div className="dropdown-list position-absolute top-100 start-0 end-0 bg-white border rounded mt-2 shadow-lg" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto' }}>
            {isLoadingCompanies ? (
              <div className="p-3 text-center">
                <div className="spinner-border spinner-border-sm me-2" style={{ color: '#0056D2' }} role="status"></div>
                <span style={{ color: '#6B7280' }}>Searching...</span>
              </div>
            ) : companies.length === 0 ? (
              <div className="p-3 text-center" style={{ color: '#6B7280' }}>
                No companies found
              </div>
            ) : (
              companies.map(company => (
                <div
                  key={company.id}
                  className="dropdown-item p-3 border-bottom cursor-pointer"
                  style={{ transition: 'background 0.2s ease', fontSize: '14px' }}
                  onClick={() => {
                    onInputChange('companyId', String(company.id));
                    onInputChange('companyName', company.name);
                    onCompanySearchChange('');
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div className="fw-medium" style={{ color: '#111827' }}>{company.name}</div>
                  {company.domain && (
                    <div className="small" style={{ color: '#6B7280' }}>{company.domain}</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {formData.companyName && (
        <div className="mb-4 p-3 rounded border" style={{ background: '#EBF5FF', borderColor: '#0056D2' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="material-icons" style={{ fontSize: '20px', color: '#0056D2' }}>check_circle</span>
            <span className="fw-medium" style={{ color: '#0056D2', fontSize: '14px' }}>
              Selected: <strong>{formData.companyName}</strong>
            </span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-center gap-2 p-3 border rounded" style={{ background: '#F9FAFB', borderColor: '#E5E7EB' }}>
          <span className="material-icons" style={{ fontSize: '20px', color: '#9CA3AF' }}>info</span>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>Want to create a new company?</span>
          <button
            type="button"
            disabled
            className="btn btn-sm"
            style={{ 
              background: '#9CA3AF',
              color: 'white',
              border: 'none',
              fontSize: '12px',
              padding: '6px 12px',
              cursor: 'not-allowed',
              opacity: 0.6
            }}
          >
            Create Company (Coming Soon)
          </button>
        </div>
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
          onClick={handleContinue}
          className="btn flex-fill fw-bold"
          disabled={!formData.companyId}
          style={{ 
            height: '46px',
            borderRadius: '8px',
            background: formData.companyId ? '#0056D2' : '#9CA3AF',
            color: 'white',
            fontSize: '15px',
            border: 'none',
            padding: '14px',
            cursor: formData.companyId ? 'pointer' : 'not-allowed'
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default Step2CompanySelection;

