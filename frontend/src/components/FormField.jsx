import React from 'react';
import './FormField.css';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  options = [],
  disabled = false,
  className = ''
}) => {
  const fieldId = `field-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`form-select ${error ? 'error' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            aria-required={required}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`form-textarea ${error ? 'error' : ''}`}
            rows={4}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            aria-required={required}
          />
        );
      default:
        return (
          <input
            id={fieldId}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`form-input ${error ? 'error' : ''}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            aria-required={required}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {renderInput()}
      {error && (
        <span id={errorId} className="form-error" role="alert" aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;