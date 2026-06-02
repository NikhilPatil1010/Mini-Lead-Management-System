import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, id, ...props }, ref) => {
  return (
    <div className="mb-3">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
