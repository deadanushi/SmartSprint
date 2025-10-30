import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import AlertModal from '../components/AlertModal';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState<React.ReactNode>('');

  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/tasks';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const openComingSoon = (provider: string) => {
    setModalTitle(`${provider} login`);
    setModalMessage(
      <div>
        This sign-in method will be available soon. For now, use email and password.
      </div>
    );
    setModalOpen(true);
  };

  const pageStyles: React.CSSProperties = {
    minHeight: 'calc(100vh - 88px)',
    background: '#F6F8FC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  };

  const cardStyles: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 10px 28px rgba(2, 6, 23, 0.08)',
    border: '1px solid #E5E7EB',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 6px 0',
    textAlign: 'center',
  };

  const subtitleStyles: React.CSSProperties = {
    fontSize: '13px',
    color: '#64748B',
    margin: '0 0 20px 0',
    textAlign: 'center',
  };

  const formStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '14px',
  };

  const fullRow: React.CSSProperties = {
    gridColumn: '1 / -1',
  };

  const inputGroupStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155',
  };

  const inputStyles: React.CSSProperties = {
    height: '30px',
    padding: '12px 14px',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    outline: 'none',
    background: '#FFFFFF',
    width: '100%'
  };

  const buttonStyles: React.CSSProperties = {
    background: '#0B1324',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    height: '46px',
    fontSize: '15px',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%'
  };

  const disabledButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: '#94A3B8',
    cursor: 'not-allowed',
  };

  const dividerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    margin: '18px 0',
    gap: '14px',
  };

  const dividerLineStyles: React.CSSProperties = {
    flex: 1,
    height: '1px',
    background: '#E5E7EB',
  };

  const dividerTextStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#94A3B8',
    fontWeight: 700,
  };

  const linkStyles: React.CSSProperties = {
    color: '#0F172A',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 700,
    transition: 'color 0.2s ease',
  };

  const footerStyles: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '13px',
    color: '#64748B',
  };

  const oauthIconRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '10px',
  };

  const oauthIconStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #E5E7EB',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(2, 6, 23, 0.06)'
  };

  return (
    <div style={pageStyles}>
      <div style={cardStyles}>
        <h2 style={titleStyles}>Welcome back</h2>
        <p style={subtitleStyles}>Sign in to your account to continue</p>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '12px',
            color: '#DC2626',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <form style={formStyles} onSubmit={handleSubmit}>
          <div style={{ ...inputGroupStyles, ...fullRow }}>
            <label style={labelStyles}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={inputStyles}
              required
            />
          </div>

          <div style={{ ...inputGroupStyles, ...fullRow }}>
            <label style={labelStyles}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyles}
              required
            />
          </div>

          <div style={fullRow}>
            <button
              type="submit"
              style={isLoading ? disabledButtonStyles : buttonStyles}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#0A0F1F';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#0B1324';
                }
              }}
            >
              {isLoading ? (
                <>
                  <span className="material-icons" style={{ fontSize: '16px' }}>hourglass_empty</span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Round OAuth icons */}
            <div style={oauthIconRowStyles}>
              <button
                type="button"
                title="Continue with Google"
                style={oauthIconStyles}
                onClick={() => openComingSoon('Google')}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
              >
                <span style={{ color: '#EA4335', fontWeight: 900 }}>G</span>
              </button>
              <button
                type="button"
                title="Continue with GitHub"
                style={oauthIconStyles}
                onClick={() => openComingSoon('GitHub')}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
              >
                <span style={{ color: '#0F172A', fontWeight: 900 }}>GH</span>
              </button>
            </div>
          </div>
        </form>

        <div style={dividerStyles}>
          <div style={dividerLineStyles}></div>
          <span style={dividerTextStyles}>Don't have an account?</span>
          <div style={dividerLineStyles}></div>
        </div>

        <div style={footerStyles}>
          <Link to="/register" style={linkStyles}>
            Create an account
          </Link>
        </div>
      </div>

      <AlertModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        variant="info"
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
