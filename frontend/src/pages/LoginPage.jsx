import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card glass-panel border-0" style={{ width: '100%', maxWidth: '420px', background: 'rgba(255, 255, 255, 0.9)' }}>
        <div className="card-body p-5">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-kanban fs-4" />
            </div>
          </div>
          <h3 className="text-center mb-1 fw-bold text-secondary">Lead Manager</h3>
          <p className="text-center text-muted mb-4 fs-6">Sign in to your account</p>

          {error && (
            <div className="alert alert-danger py-2 border-0" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }} role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium text-secondary" style={{ fontSize: '0.9rem' }}>Email Address</label>
              <input
                id="email"
                type="email"
                className="form-control form-control-lg bg-light border-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium text-secondary" style={{ fontSize: '0.9rem' }}>Password</label>
              <input
                id="password"
                type="password"
                className="form-control form-control-lg bg-light border-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-100 mb-4 py-2 fs-6 shadow-glow" loading={loading}>
              Sign In
            </Button>
            <div className="text-center">
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Don't have an account? </span>
              <Link to="/register" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.9rem' }}>Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
