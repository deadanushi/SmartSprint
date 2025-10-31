import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
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

  return (
    <div className="login-page min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="login-card bg-white rounded-4 p-5 w-100" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold mb-2" style={{ color: '#0F172A', fontSize: '20px', fontWeight: 800 }}>Welcome back</h1>
          <p className="mb-0" style={{ color: '#64748B', fontSize: '13px' }}>Sign in to your account to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <span className="material-icons" style={{ fontSize: '20px' }}>error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold mb-1" style={{ fontSize: '13px', color: '#334155' }}>Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              style={{ 
                height: '46px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                padding: '12px 14px'
              }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-bold mb-1" style={{ fontSize: '13px', color: '#334155' }}>Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              style={{ 
                height: '46px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                padding: '12px 14px'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 mb-4 fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={isLoading}
            style={{ 
              height: '46px',
              borderRadius: '10px',
              background: isLoading ? '#94A3B8' : '#0056D2',
              color: 'white',
              fontSize: '15px',
              border: 'none'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="d-flex justify-content-center gap-3 mb-4">
            <button
              type="button"
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(2, 6, 23, 0.06)'
              }}
              title="Continue with Google"
              onClick={() => openComingSoon('Google')}
            >
              <span className="text-danger fw-bold">G</span>
            </button>
            <button
              type="button"
              className="btn rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(2, 6, 23, 0.06)'
              }}
              title="Continue with GitHub"
              onClick={() => openComingSoon('GitHub')}
            >
              <span className="text-dark fw-bold">GH</span>
            </button>
          </div>
        </form>

        <div className="d-flex align-items-center my-4 gap-3">
          <hr className="flex-grow-1" style={{ borderColor: '#E5E7EB', margin: 0 }} />
          <span className="fw-bold" style={{ fontSize: '12px', color: '#94A3B8' }}>Don't have an account?</span>
          <hr className="flex-grow-1" style={{ borderColor: '#E5E7EB', margin: 0 }} />
        </div>

        <div className="text-center">
          <Link to="/register" className="text-decoration-none fw-bold" style={{ color: '#0056D2', fontSize: '14px' }}>
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
