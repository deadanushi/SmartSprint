import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import AlertModal from '../../components/AlertModal';
import { useUser } from '../../contexts/UserContext';
import { registerUser } from '../../services/userService';
import { useRegisterData } from '../../hooks/useRegisterData';
import type { RegisterFormData } from './types';
import Step1AccountDetails from './components/Step1AccountDetails';
import Step2CompanySelection from './components/Step2CompanySelection';
import Step3RoleSelection from './components/Step3RoleSelection';
import Step4ProfilePicture from './components/Step4ProfilePicture';
import Step5TermsConfirmation from './components/Step5TermsConfirmation';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyId: '',
    companyName: '',
    avatarUrl: null,
    acceptTerms: false,
    emailNotifications: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState<React.ReactNode>('');
  const [modalVariant, setModalVariant] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  // Use custom hook to aggregate role and company data
  const { roles, companies, isLoadingRoles, isLoadingCompanies, searchCompanies: handleSearchCompanies, refetchRoles } = useRegisterData();

  useEffect(() => {
    if (step === 3 && roles.length === 0) {
      refetchRoles();
    }
  }, [step, roles.length, refetchRoles]);

  useEffect(() => {
    if (companySearch.trim().length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearchCompanies(companySearch);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [companySearch, handleSearchCompanies]);

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showError = (title: string, message: string, variant: 'error' | 'warning' | 'info' = 'error') => {
    setModalTitle(title);
    setModalMsg(message);
    setModalVariant(variant);
    setModalOpen(true);
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role || 'other',
        avatar_url: formData.avatarUrl,
      });
      
      // Automatically log in after successful registration
      const loginResult = await login(formData.email, formData.password);
      
      if (loginResult.success) {
        setModalTitle('Account created');
        setModalMsg('Your account has been created successfully. You are now logged in.');
        setModalVariant('success');
        setModalOpen(true);
        setTimeout(() => {
          navigate('/tasks');
        }, 1500);
      } else {
        setModalTitle('Account created');
        setModalMsg('Your account has been created successfully. Please sign in to continue.');
        setModalVariant('success');
        setModalOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (e: any) {
      const msg = e?.message || 'Registration failed';
      showError('Registration failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1AccountDetails
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            showError={showError}
          />
        );
      case 2:
        return (
          <Step2CompanySelection
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            showError={showError}
            companySearch={companySearch}
            onCompanySearchChange={setCompanySearch}
            companies={companies}
            isLoadingCompanies={isLoadingCompanies}
          />
        );
      case 3:
        return (
          <Step3RoleSelection
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            showError={showError}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
          />
        );
      case 4:
        return (
          <Step4ProfilePicture
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            showError={showError}
            avatarPreview={avatarPreview}
            onAvatarPreviewChange={setAvatarPreview}
          />
        );
      case 5:
        return (
          <Step5TermsConfirmation
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
            showError={showError}
            roles={roles}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="register-card bg-white rounded-4 p-5 w-100" style={{ maxWidth: '600px' }}>
        <div className="logo-section text-center mb-4">
          <p className="mb-0" style={{ color: '#6B7280', fontSize: '14px' }}>SMART SPRINT</p>
        </div>

        <div className="step-indicator-wizard mb-4">
          <div className="d-flex align-items-start justify-content-between position-relative" style={{ padding: '0 20px' }}>
            {/* Connecting line */}
            <div 
              className="step-connector position-absolute"
              style={{
                top: '20px',
                left: '60px',
                right: '60px',
                height: '2px',
                background: '#E5E7EB',
                zIndex: 0
              }}
            />
            
            {[
              { num: 1, label: 'ACCOUNT DETAILS' },
              { num: 2, label: 'COMPANY' },
              { num: 3, label: 'ROLE' },
              { num: 4, label: 'PROFILE PICTURE' },
              { num: 5, label: 'CONFIRMATION' }
            ].map(({ num, label }) => (
              <div key={num} className="step-item-wizard d-flex flex-column align-items-center position-relative" style={{ zIndex: 1, flex: '1' }}>
                <div
                  className={clsx(
                    'step-circle-wizard rounded-circle d-flex align-items-center justify-content-center',
                    { 'active': num === step }
                  )}
                >
                  {num}
                </div>
                <label 
                  className={clsx('step-label-wizard', { 'active': num === step })}
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {renderCurrentStep()}

        <div className="text-center mt-4 pt-3 border-top">
          <span style={{ color: '#6B7280', fontSize: '14px' }}>Already have an account? </span>
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#0056D2', fontSize: '14px' }}>
            Sign in
          </Link>
        </div>
      </div>
      <AlertModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMsg}
        variant={modalVariant}
      />
    </div>
  );
};

export default RegisterPage;

