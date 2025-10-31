import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import AlertModal from '../components/AlertModal';
import { useUser } from '../contexts/UserContext';
import { getRoles, searchCompanies, registerUser, type RoleDto, type CompanyDto } from '../services/api';

type Role = RoleDto;
type Company = CompanyDto;

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    companyId: '',
    companyName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState<React.ReactNode>('');
  const [modalVariant, setModalVariant] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  const getRoleIcon = (roleKey: string): string => {
    const iconMap: { [key: string]: string } = {
      'admin': 'admin_panel_settings',
      'project-manager': 'supervisor_account',
      'frontend-developer': 'code',
      'backend-developer': 'storage',
      'fullstack-developer': 'developer_mode',
      'qa-tester': 'bug_report',
      'devops-engineer': 'cloud',
      'ui-ux-designer': 'palette',
      'data-analyst': 'analytics',
      'product-manager': 'inventory',
      'scrum-master': 'group_work',
      'technical-lead': 'engineering',
      'other': 'person',
    };
    return iconMap[roleKey] || 'person';
  };

  useEffect(() => {
    if (step === 2 && roles.length === 0) {
      setIsLoadingRoles(true);
      getRoles()
        .then(data => setRoles(data))
        .catch(error => {
          console.error('Error fetching roles:', error);
          setModalTitle('Error loading roles');
          setModalMsg('Failed to load roles. Please refresh the page.');
          setModalVariant('error');
          setModalOpen(true);
        })
        .finally(() => setIsLoadingRoles(false));
    }
  }, [step, roles.length]);

  useEffect(() => {
    if (companySearch.trim().length === 0) {
      setCompanies([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsLoadingCompanies(true);
      searchCompanies(companySearch)
        .then(data => setCompanies(data.filter((c) => c.is_active)))
        .catch(error => {
          console.error('Error searching companies:', error);
          setCompanies([]);
        })
        .finally(() => setIsLoadingCompanies(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [companySearch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          setModalTitle('Passwords do not match');
          setModalMsg('Please make sure both password fields are identical.');
          setModalVariant('error');
          setModalOpen(true);
          return;
        }
        setStep(2);
      } else {
        setModalTitle('Missing information');
        setModalMsg('Please fill out all fields to continue.');
        setModalVariant('warning');
        setModalOpen(true);
      }
    } else if (step === 2) {
      if (formData.role) {
        setStep(3);
      } else {
        setModalTitle('Select a role');
        setModalMsg('Please choose your primary role to continue.');
        setModalVariant('info');
        setModalOpen(true);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && formData.companyId) {
      setIsLoading(true);
      try {
        await registerUser({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role || 'other',
          avatar_url: null,
        });
        
        // Automatically log in after successful registration
        const loginResult = await login(formData.email, formData.password);
        
        if (loginResult.success) {
          setModalTitle('Account created');
          setModalMsg('Your account has been created successfully. You are now logged in.');
          setModalVariant('success');
          setModalOpen(true);
          // Navigate to tasks page after a short delay to show the success message
          setTimeout(() => {
            navigate('/tasks');
          }, 1500);
        } else {
          // Registration succeeded but login failed - redirect to login page
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
        setModalTitle('Registration failed');
        setModalMsg(msg);
        setModalVariant('error');
        setModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Create your account</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Let's get started with your basic information</p>
      
      <div className="d-flex flex-column gap-3">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>First name</label>
            <input
              type="text"
              className="form-control"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
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
            <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Last name</label>
            <input
              type="text"
              className="form-control"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
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

        <div>
          <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Email address</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
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

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
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
            <label className="form-label fw-medium mb-1" style={{ fontSize: '14px', color: '#374151' }}>Confirm password</label>
            <input
              type="password"
              className="form-control"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
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

        <button
          type="button"
          onClick={handleNext}
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

  const renderStep2 = () => (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>What's your role?</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Select your primary role in the team</p>
      
      {isLoadingRoles ? (
        <div className="text-center py-5">
          <div className="spinner-border mb-3" style={{ color: '#0056D2' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0" style={{ color: '#6B7280' }}>Loading roles...</p>
        </div>
      ) : (
        <div className="role-grid row g-3 mb-4">
          {roles.map(role => (
            <div
              key={role.id}
              className="col-6 col-md-4"
            >
              <div
                className="role-card border rounded p-3 text-center cursor-pointer h-100"
                onClick={() => handleInputChange('role', role.role_key)}
                style={{ 
                  background: formData.role === role.role_key ? '#EBF5FF' : '#FAFBFC',
                  borderColor: formData.role === role.role_key ? '#0056D2' : '#E5E7EB',
                  transition: 'all 0.2s ease'
                }}
              >
                <span className="material-icons d-block mb-2" style={{ 
                  fontSize: '24px',
                  color: formData.role === role.role_key ? '#0056D2' : '#6B7280'
                }}>
                  {getRoleIcon(role.role_key)}
                </span>
                <div className="small fw-medium" style={{ 
                  color: formData.role === role.role_key ? '#0056D2' : '#374151',
                  fontSize: '14px'
                }}>
                  {role.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        className="btn w-100 fw-bold d-flex align-items-center justify-content-center"
        disabled={!formData.role}
        style={{ 
          height: '46px',
          borderRadius: '8px',
          background: formData.role ? '#0056D2' : '#9CA3AF',
          color: 'white',
          fontSize: '15px',
          border: 'none',
          padding: '14px',
          cursor: formData.role ? 'pointer' : 'not-allowed'
        }}
      >
        Continue
      </button>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="text-center mb-2" style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>Join your team</h2>
      <p className="text-center mb-4" style={{ fontSize: '14px', color: '#6B7280' }}>Search and select your company</p>
      
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control"
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
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
                    handleInputChange('companyId', String(company.id));
                    handleInputChange('companyName', company.name);
                    setCompanySearch('');
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

      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          disabled={!formData.companyId || isLoading}
          style={{ 
            height: '46px',
            borderRadius: '8px',
            background: (formData.companyId && !isLoading) ? '#0056D2' : '#9CA3AF',
            color: 'white',
            fontSize: '15px',
            border: 'none',
            padding: '14px',
            cursor: (formData.companyId && !isLoading) ? 'pointer' : 'not-allowed'
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </>
  );

  return (
    <div className="page-container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="register-card bg-white rounded-4 p-5 w-100" style={{ maxWidth: '600px' }}>
        <div className="logo-section text-center mb-4">
          <h1 className="h3 fw-bold mb-2" style={{ color: '#0056D2', fontSize: '32px', fontWeight: 700 }}>TaskFlow</h1>
          <p className="mb-0" style={{ color: '#6B7280', fontSize: '14px' }}>Project Management Made Simple</p>
        </div>

        <div className="step-indicator d-flex justify-content-center gap-2 mb-4">
          {[1, 2, 3].map(stepNum => (
            <div
              key={stepNum}
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{ 
                width: '36px', 
                height: '36px', 
                fontSize: '14px',
                background: stepNum === step ? '#0056D2' : (stepNum < step ? '#10B981' : '#F3F4F6'),
                color: stepNum > step ? '#9CA3AF' : 'white'
              }}
            >
              {stepNum < step ? '✓' : stepNum}
            </div>
          ))}
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

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
