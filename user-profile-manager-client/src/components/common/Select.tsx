import type { SelectOption } from '../../types';

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string | false;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Reusable dropdown select with label and inline error display
 */
const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.8rem] font-semibold text-text-secondary uppercase tracking-[0.05em]"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <select
        id={id}
        className={`
          w-full px-4 py-3 pr-10 border-2 rounded-xl bg-input-bg text-text-primary text-[0.95rem]
          font-sans transition-all duration-300 outline-none cursor-pointer
          appearance-none
          bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='12'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%2394a3b8'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpolyline%20points='6%209%2012%2015%2018%209'%3E%3C/polyline%3E%3C/svg%3E")]
          bg-no-repeat bg-[position:right_16px_center]
          focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-glow)]
          ${error ? 'border-error shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-border'}
        `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-surface text-text-primary"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="flex items-center gap-1.5 text-[0.8rem] text-error animate-[slideDown_0.2s_ease]">
          <svg
            className="shrink-0 w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;
