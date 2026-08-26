import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, ...rest }: Props) {
  return (
    <div className="ui-field">
      <label className="ui-label" htmlFor={id}>{label}</label>
      <input className={`ui-input ${error ? 'ui-input--error' : ''}`} id={id} {...rest} />
      {error && <span className="ui-error">{error}</span>}
    </div>
  );
}
