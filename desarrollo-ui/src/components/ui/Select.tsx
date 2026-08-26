import type { SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export default function Select({ label, options, placeholder, error, id, ...rest }: Props) {
  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={id}>{label}</label>
      <select className={`ui-select ${error ? 'ui-select--error' : ''}`} id={id} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="ui-error">{error}</span>}
    </div>
  );
}
