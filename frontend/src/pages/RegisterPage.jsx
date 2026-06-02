import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../api/auth.api';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('agent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Register the user with the selected role
      await registerUser({ name, email, password, role });
      // Automatically log them in after registration
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card glass-panel border-0" style={{ width: '100%', maxWidth: '460px', background: 'rgba(255, 255, 255, 0.9)' }}>
        <div className="card-body p-5">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-kanban fs-4" />
            </div>
          </div>
          <h3 className="text-center mb-1 fw-bold text-secondary">Lead Manager</h3>
          <p className="text-center text-muted mb-4 fs-6">Create your account</p>

          {error && (
            <div className="alert alert-danger py-2 border-0" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }} role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-medium text-secondary" style={{ fontSize: '0.9rem' }}>Full Name</label>
              <input
                id="name"
                type="text"
                className="form-control form-control-lg bg-light border-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
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
            <div className="mb-3">
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
            <div className="mb-4">
              <label htmlFor="role" className="form-label fw-medium text-secondary" style={{ fontSize: '0.9rem' }}>Role</label>
              <select
                id="role"
                className="form-select form-select-lg bg-light border-0"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="agent">Agent (Normal User)</option>
              </select>
            </div>
            <Button type="submit" className="w-100 mb-4 py-2 fs-6 shadow-glow" loading={loading}>
              Sign Up
            </Button>
            <div className="text-center">
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Already have an account? </span>
              <Link to="/login" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.9rem' }}>Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
