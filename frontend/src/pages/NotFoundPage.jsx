import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <h1 className="display-1 fw-bold text-muted">404</h1>
      <p className="lead">Page not found</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}
