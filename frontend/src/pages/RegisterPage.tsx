import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlertModal from '../components/AlertModal';
import { createUser } from '../services/userService';

interface Role {
  id: string;
  name: string;
  icon: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
}

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [createdCompany, setCreatedCompany] = useState(false);
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('Other');
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMsg, setModalMsg] = useState<React.ReactNode>('');
  const [modalVariant, setModalVariant] = useState<'info' | 'success' | 'error' | 'warning'>('info');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles: Role[] = [
    { id: 'project-manager', name: 'Project Manager', icon: 'supervisor_account' },
    { id: 'frontend-developer', name: 'Frontend Developer', icon: 'code' },
    { id: 'backend-developer', name: 'Backend Developer', icon: 'storage' },
    { id: 'fullstack-developer', name: 'Full Stack Developer', icon: 'developer_mode' },
    { id: 'qa-tester', name: 'QA Tester', icon: 'bug_report' },
    { id: 'devops-engineer', name: 'DevOps Engineer', icon: 'cloud' },
    { id: 'ui-ux-designer', name: 'UI/UX Designer', icon: 'palette' },
    { id: 'data-analyst', name: 'Data Analyst', icon: 'analytics' },
    { id: 'product-manager', name: 'Product Manager', icon: 'inventory' },
    { id: 'scrum-master', name: 'Scrum Master', icon: 'group_work' },
    { id: 'technical-lead', name: 'Technical Lead', icon: 'engineering' },
    { id: 'other', name: 'Other', icon: 'person' },
  ];

  const companies: Company[] = useMemo<Company[]>(() => ([
    { id: '1', name: 'Google', industry: 'Technology' },
    { id: '2', name: 'Microsoft', industry: 'Technology' },
    { id: '3', name: 'Apple', industry: 'Technology' },
    { id: '4', name: 'Amazon', industry: 'E-commerce' },
    { id: '5', name: 'Meta', industry: 'Social Media' },
    { id: '6', name: 'Netflix', industry: 'Entertainment' },
    { id: '7', name: 'Tesla', industry: 'Automotive' },
    { id: '8', name: 'Spotify', industry: 'Music' },
    { id: '9', name: 'Airbnb', industry: 'Travel' },
    { id: '10', name: 'Uber', industry: 'Transportation' },
    { id: '11', name: 'Slack', industry: 'Communication' },
    { id: '12', name: 'Zoom', industry: 'Video Conferencing' },
  ]), []);

  const filteredCompanies = useMemo(() => (
    companies.filter(company =>
      company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      company.industry.toLowerCase().includes(companySearch.toLowerCase())
    )
  ), [companySearch, companies]);

  const hasExactCompany = useMemo(() => {
    const term = companySearch.trim().toLowerCase();
    if (!term) return false;
    return companies.some(c => c.name.toLowerCase() === term);
  }, [companySearch, companies]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.role) newErrors.role = 'Please select your role';
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company) newErrors.company = 'Please select your company';
    if (createdCompany) {
      if (!formData.company.trim()) newErrors.company = 'Enter a company name';
      if (!newCompanyIndustry) newErrors.companyIndustry = 'Select an industry';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handlePrev = () => {
    setErrors({});
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && validateStep3()) {
      setIsLoading(true);
      try {
        const res = await createUser({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role || 'member',
          avatar_url: null,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const msg = err?.detail || `Registration failed (${res.status})`;
          setModalTitle('Registration failed');
          setModalMsg(msg);
          setModalVariant('error');
          setModalOpen(true);
        } else {
          await res.json();
          setModalTitle('Account created');
          setModalMsg('Your account has been created successfully. You can now sign in.');
          setModalVariant('success');
          setModalOpen(true);
          navigate('/login');
        }
      } catch (error) {
        setModalTitle('Network error');
        setModalMsg('Network error. Please ensure the backend is running.');
        setModalVariant('error');
        setModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const pageStyles: React.CSSProperties = {
    minHeight: '100vh',
    background: '#F9FAFB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '48px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB',
  };

  

  const stepIndicatorStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
    gap: '8px',
  };

  const stepStyles: React.CSSProperties = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    background: '#F3F4F6',
    color: '#6B7280',
    border: '1px solid #E5E7EB',
  };

  const activeStepStyles: React.CSSProperties = {
    ...stepStyles,
    background: '#0056D2',
    color: 'white',
  };

  const completedStepStyles: React.CSSProperties = {
    ...stepStyles,
    background: '#10B981',
    color: 'white',
  };

  const errorTextStyles: React.CSSProperties = {
    color: '#DC2626',
    fontSize: '12px',
    marginTop: '4px',
  };

  const navRowStyles: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
    marginTop: '8px',
    marginBottom: '24px',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0',
    textAlign: 'center',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 32px 0',
    textAlign: 'center',
  };

  const formStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const rowStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
  };

  const inputGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  };

  const inputStyles: React.CSSProperties = {
    padding: '12px 16px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    outline: 'none',
    background: '#FAFBFC',
  };

  const buttonStyles: React.CSSProperties = {
    background: '#0056D2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const disabledButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: '#9CA3AF',
    cursor: 'not-allowed',
  };

  const secondaryButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: '#F3F4F6',
    color: '#111827',
    border: '1px solid #E5E7EB',
  };

  const roleGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginTop: '16px',
  };

  const roleCardStyles: React.CSSProperties = {
    padding: '16px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    background: '#FAFBFC',
  };

  const selectedRoleCardStyles: React.CSSProperties = {
    ...roleCardStyles,
    borderColor: '#0056D2',
    background: '#EBF5FF',
  };

  const roleIconStyles: React.CSSProperties = {
    fontSize: '24px',
    marginBottom: '8px',
    color: '#6B7280',
  };

  const selectedRoleIconStyles: React.CSSProperties = {
    ...roleIconStyles,
    color: '#0056D2',
  };

  const roleNameStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  };

  const selectedRoleNameStyles: React.CSSProperties = {
    ...roleNameStyles,
    color: '#0056D2',
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'relative',
    marginTop: '20px',
  };

  const dropdownInputStyles: React.CSSProperties = {
    ...inputStyles,
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 18px',
  };

  const dropdownListStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
    marginTop: '6px',
    padding: '8px 0',
  };

  const dropdownItemStyles: React.CSSProperties = {
    padding: '14px 18px',
    cursor: 'pointer',
    borderBottom: '1px solid #F3F4F6',
    fontSize: '14px',
    transition: 'background 0.2s ease',
  };

  const footerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#6B7280',
  };

  const linkStyles: React.CSSProperties = {
    color: '#0056D2',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  };

  const renderStep1 = () => (
    <>
      <h2 style={titleStyles}>Create your account</h2>
      <p style={subtitleStyles}>Let's get started with your basic information</p>
      
      <form style={formStyles}>
        <div style={rowStyles}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>First name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              style={inputStyles}
              required
            />
            {errors.firstName && <div style={errorTextStyles}>{errors.firstName}</div>}
          </div>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Last name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              style={inputStyles}
              required
            />
            {errors.lastName && <div style={errorTextStyles}>{errors.lastName}</div>}
          </div>
        </div>

        <div style={inputGroupStyles}>
          <label style={labelStyles}>Email address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            style={inputStyles}
            required
          />
          {errors.email && <div style={errorTextStyles}>{errors.email}</div>}
        </div>

        <div style={rowStyles}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a password"
              style={inputStyles}
              required
            />
            {errors.password && <div style={errorTextStyles}>{errors.password}</div>}
          </div>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>Confirm password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              style={inputStyles}
              required
            />
            {errors.confirmPassword && <div style={errorTextStyles}>{errors.confirmPassword}</div>}
          </div>
        </div>

        <div style={navRowStyles}>
          <button
            type="button"
            onClick={handleNext}
            style={buttonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0043A0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0056D2';
            }}
          >
            Continue
          </button>
        </div>
      </form>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 style={titleStyles}>What's your role?</h2>
      <p style={subtitleStyles}>Select your primary role in the team</p>
      
      <div style={roleGridStyles}>
        {roles.map(role => (
          <div
            key={role.id}
            style={formData.role === role.id ? selectedRoleCardStyles : roleCardStyles}
            onClick={() => handleInputChange('role', role.id)}
                onMouseEnter={(e) => {
                  if (formData.role !== role.id) {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.background = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.role !== role.id) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.background = '#FAFBFC';
                  }
                }}
          >
            <span 
              className="material-icons" 
              style={formData.role === role.id ? selectedRoleIconStyles : roleIconStyles}
            >
              {role.icon}
            </span>
            <div style={formData.role === role.id ? selectedRoleNameStyles : roleNameStyles}>
              {role.name}
            </div>
          </div>
        ))}
      </div>
      {errors.role && <div style={{ ...errorTextStyles, marginTop: '8px' }}>{errors.role}</div>}

      <div style={navRowStyles}>
        <button
          type="button"
          onClick={handlePrev}
          style={secondaryButtonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F3F4F6';
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          style={buttonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0043A0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0056D2';
          }}
        >
          Continue
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 style={titleStyles}>Join your team</h2>
      <p style={subtitleStyles}>Search and select your company</p>
      
      <div style={dropdownStyles}>
        <input
          type="text"
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          placeholder="Search for your company..."
          style={dropdownInputStyles}
        />
        {companySearch && (
          <div style={dropdownListStyles}>
            {filteredCompanies.map(company => (
              <div
                key={company.id}
                style={dropdownItemStyles}
                onClick={() => {
                  handleInputChange('company', company.name);
                  setCompanySearch('');
                  setCreatedCompany(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <div style={{ fontWeight: '500', color: '#111827' }}>{company.name}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{company.industry}</div>
              </div>
            ))}
            {!hasExactCompany && companySearch.trim() && (
              <div
                style={{ ...dropdownItemStyles, display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFF' }}
                onClick={() => {
                  const name = companySearch.trim();
                  handleInputChange('company', name);
                  setCreatedCompany(true);
                  setCompanySearch('');
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F8FAFF'; }}
              >
                <span className="material-icons" style={{ fontSize: '18px', color: '#2563EB' }}>add_circle</span>
                <span>Create "{companySearch.trim()}"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {formData.company && (
        <div style={{
          padding: '12px 16px',
          background: '#EBF5FF',
          border: '1px solid #0056D2',
          borderRadius: '8px',
          marginTop: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#0056D2' }}>
              Selected: {formData.company}
            </div>
            <button
              type="button"
              style={{
                background: 'transparent',
                color: '#0056D2',
                border: '1px solid #93C5FD',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => { handleInputChange('company', ''); setCreatedCompany(false); }}
            >
              Change
            </button>
          </div>
          {createdCompany && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 700 }}>New company will be created</span>
              <select
                value={newCompanyIndustry}
                onChange={(e) => setNewCompanyIndustry(e.target.value)}
                style={{
                  padding: '8px 10px',
                  border: '1px solid #93C5FD',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '12px',
                  color: '#1F2937',
                }}
              >
                <option value="Technology">Technology</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Social Media">Social Media</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Automotive">Automotive</option>
                <option value="Music">Music</option>
                <option value="Travel">Travel</option>
                <option value="Transportation">Transportation</option>
                <option value="Communication">Communication</option>
                <option value="Video Conferencing">Video Conferencing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}
        </div>
      )}
      {errors.company && <div style={{ ...errorTextStyles, marginTop: '8px' }}>{errors.company}</div>}
      {errors.companyIndustry && <div style={{ ...errorTextStyles, marginTop: '4px' }}>{errors.companyIndustry}</div>}

      <form style={formStyles} onSubmit={handleSubmit}>
        <div style={navRowStyles}>
          <button
            type="button"
            onClick={handlePrev}
            style={secondaryButtonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
            }}
          >
            Back
          </button>
          <button
            type="submit"
            style={isLoading ? disabledButtonStyles : buttonStyles}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#0043A0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#0056D2';
              }
            }}
          >
            {isLoading ? (
              <>
                <span className="material-icons" style={{ fontSize: '16px' }}>hourglass_empty</span>
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>
    </>
  );

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <div style={stepIndicatorStyles}>
          {[1, 2, 3].map(stepNum => (
            <div
              key={stepNum}
              style={
                stepNum < step
                  ? completedStepStyles
                  : stepNum === step
                  ? activeStepStyles
                  : stepStyles
              }
              title={stepNum === 1 ? 'Account' : stepNum === 2 ? 'Role' : 'Company'}
            >
              {stepNum < step ? '✓' : stepNum}
            </div>
          ))}
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div style={footerStyles}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyles}>
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

