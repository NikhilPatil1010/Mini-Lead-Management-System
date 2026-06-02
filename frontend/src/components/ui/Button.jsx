export default function Button({ children, variant = 'primary', size = '', loading = false, ...props }) {
  const className = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${props.className || ''}`.trim();

  return (
    <button {...props} className={className} disabled={loading || props.disabled}>
      {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
      {children}
    </button>
  );
}
