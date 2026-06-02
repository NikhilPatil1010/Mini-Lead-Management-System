import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top glass-panel mb-4 mx-3 mt-3" style={{ border: '1px solid var(--color-border)', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.9)' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-gradient d-flex align-items-center" to="/">
          <div className="bg-primary text-white rounded p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-kanban" />
          </div>
          LeadPro
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto ms-4">
            <li className="nav-item me-2">
              <Link className={`nav-link fw-medium px-3 rounded ${location.pathname === '/' ? 'bg-primary text-white' : 'text-secondary'}`} to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link fw-medium px-3 rounded ${location.pathname === '/leads' ? 'bg-primary text-white' : 'text-secondary'}`} to="/leads">Leads</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center bg-light rounded-pill p-1 pe-3 border">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-2" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="d-flex flex-column lh-1 me-3">
              <span className="fw-semibold" style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>{user?.name}</span>
              <span className="text-muted text-capitalize" style={{ fontSize: '0.7rem' }}>{user?.role}</span>
            </div>
            <button className="btn btn-sm btn-light border text-danger rounded-circle p-1" onClick={logout} title="Logout" style={{ width: '28px', height: '28px' }}>
              <i className="bi bi-box-arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
