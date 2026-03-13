import React, { useState, useId } from 'react';
import './DynamicForm.css';

// ── Tipos ──────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'email' | 'url' | 'password' | 'select' | 'checkbox' | 'textarea';

type ValidationState = 'idle' | 'success' | 'error';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: SelectOption[];        // Para select
  validate?: (value: string | boolean) => string | null; // Devuelve error o null
}

export interface DynamicFormProps {
  fields: FormFieldConfig[];
  onSubmit: (values: Record<string, string | boolean>) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

// ── Sub-componente: Spinner ────────────────────────────────────────────────

const Spinner: React.FC = () => (
  <svg
    className="form-spinner"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="form-spinner__track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="form-spinner__arc" d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ── Componente Field Individual ────────────────────────────────────────────

interface FieldProps {
  config: FormFieldConfig;
  value: string | boolean;
  error: string;
  validState: ValidationState;
  onChange: (name: string, value: string | boolean) => void;
  onBlur: (name: string) => void;
}

const FormField: React.FC<FieldProps> = ({ config, value, error, validState, onChange, onBlur }) => {
  const uid = useId();
  const inputId = `field-${uid}`;
  const errorId = `error-${uid}`;
  const helpId = `help-${uid}`;

  const ariaDescribedBy = [
    error ? errorId : null,
    config.helpText ? helpId : null,
  ].filter(Boolean).join(' ') || undefined;

  const commonProps = {
    id: inputId,
    name: config.name,
    required: config.required,
    'aria-required': config.required,
    'aria-invalid': validState === 'error' ? true : undefined,
    'aria-describedby': ariaDescribedBy,
    onBlur: () => onBlur(config.name),
    className: `form-input form-input--${validState}`,
  };

  if (config.type === 'checkbox') {
    return (
      <div className={`form-field form-field--checkbox ${validState !== 'idle' ? `form-field--${validState}` : ''}`}>
        <div className="form-field__checkbox-row">
          <input
            type="checkbox"
            id={inputId}
            name={config.name}
            checked={value as boolean}
            required={config.required}
            aria-required={config.required}
            aria-invalid={validState === 'error' ? true : undefined}
            aria-describedby={ariaDescribedBy}
            onChange={e => onChange(config.name, e.target.checked)}
            onBlur={() => onBlur(config.name)}
            className="form-checkbox"
          />
          <label htmlFor={inputId} className="form-label form-label--inline">
            {config.label}
            {config.required && <span className="form-required" aria-hidden="true"> *</span>}
          </label>
        </div>
        {config.helpText && <p id={helpId} className="form-help">{config.helpText}</p>}
        {error && <p id={errorId} role="alert" className="form-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`form-field ${validState !== 'idle' ? `form-field--${validState}` : ''}`}>
      <label htmlFor={inputId} className="form-label">
        {config.label}
        {config.required && <span className="form-required" aria-label="campo obligatorio"> *</span>}
      </label>

      {config.type === 'select' ? (
        <div className="form-select-wrapper">
          <select
            {...commonProps}
            value={value as string}
            onChange={e => onChange(config.name, e.target.value)}
          >
            <option value="">-- Selecciona una opción --</option>
            {config.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="form-select-arrow" aria-hidden="true">▾</span>
        </div>
      ) : config.type === 'textarea' ? (
        <textarea
          {...commonProps}
          value={value as string}
          placeholder={config.placeholder}
          rows={4}
          onChange={e => onChange(config.name, e.target.value)}
          className={`form-input form-textarea form-input--${validState}`}
        />
      ) : (
        <input
          {...commonProps}
          type={config.type}
          value={value as string}
          placeholder={config.placeholder}
          onChange={e => onChange(config.name, e.target.value)}
        />
      )}

      {/* Icono de validación */}
      {(validState === 'success' || validState === 'error') && config.type !== 'select' && (
        <span className={`form-validation-icon form-validation-icon--${validState}`} aria-hidden="true">
          {validState === 'success' ? '✓' : '✕'}
        </span>
      )}

      {config.helpText && <p id={helpId} className="form-help">{config.helpText}</p>}
      {error && <p id={errorId} role="alert" className="form-error">{error}</p>}
    </div>
  );
};

// ── Componente principal DynamicForm ───────────────────────────────────────

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Guardar',
  title,
  subtitle,
  className = '',
}) => {
  // Inicializar estado
  const initialValues = fields.reduce<Record<string, string | boolean>>((acc, f) => {
    acc[f.name] = f.type === 'checkbox' ? false : '';
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validStates, setValidStates] = useState<Record<string, ValidationState>>({});
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (field: FormFieldConfig, val: string | boolean): string => {
    if (field.required) {
      if (field.type === 'checkbox' && !val) return 'Este campo es obligatorio.';
      if (typeof val === 'string' && !val.trim()) return 'Este campo es obligatorio.';
    }
    if (field.validate) {
      const customError = field.validate(val);
      if (customError) return customError;
    }
    return '';
  };

  const handleChange = (name: string, value: string | boolean) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setSubmitSuccess(false);
  };

  const handleBlur = (name: string) => {
    const field = fields.find(f => f.name === name)!;
    const err = validateField(field, values[name]);
    setErrors(prev => ({ ...prev, [name]: err }));
    setValidStates(prev => ({ ...prev, [name]: err ? 'error' : values[name] !== '' && values[name] !== false ? 'success' : 'idle' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const newStates: Record<string, ValidationState> = {};

    fields.forEach(field => {
      const err = validateField(field, values[field.name]);
      newErrors[field.name] = err;
      newStates[field.name] = err ? 'error' : 'success';
    });

    setErrors(newErrors);
    setValidStates(newStates);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    setLoading(true);
    try {
      await onSubmit(values);
      setSubmitSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`dynamic-form ${className}`} aria-label={title ?? 'Formulario'}>
      {(title || subtitle) && (
        <div className="dynamic-form__header">
          {title && <h2 className="dynamic-form__title">{title}</h2>}
          {subtitle && <p className="dynamic-form__subtitle">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="dynamic-form__fields">
          {fields.map(field => (
            <FormField
              key={field.name}
              config={field}
              value={values[field.name]}
              error={errors[field.name] ?? ''}
              validState={validStates[field.name] ?? 'idle'}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </div>

        {submitSuccess && (
          <div role="status" aria-live="polite" className="form-success-banner">
            ✓ Los cambios se han guardado correctamente.
          </div>
        )}

        <div className="dynamic-form__footer">
          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            aria-busy={loading}
            className="form-submit-btn"
          >
            {loading ? (
              <>
                <Spinner />
                <span>Guardando…</span>
              </>
            ) : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
};

export default DynamicForm;
