interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string | false;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Reusable text input with label and inline error display
 */
const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
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
      <input
        id={id}
        type={type}
        className={`
          w-full px-4 py-3 border-2 rounded-xl bg-input-bg text-text-primary text-[0.95rem]
          font-sans transition-all duration-300 outline-none
          placeholder:text-text-muted
          focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-glow)]
          ${error ? 'border-error shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-border'}
        `}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        autoComplete="off"
      />
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

export default Input;
