export default function Spinner({ size = '' }) {
  const className = `spinner-border ${size ? `spinner-border-${size}` : ''} text-primary`;
  return (
    <div className="d-flex justify-content-center p-4">
      <div className={className} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
