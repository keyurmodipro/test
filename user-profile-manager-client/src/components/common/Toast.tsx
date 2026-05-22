import { useState, useEffect, useCallback } from 'react';
import type { ToastData } from '../../types';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

/**
 * Toast notification component
 * Displays success/error messages with auto-dismiss
 */
const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 4000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`
        flex items-center gap-3 px-5 py-4 rounded-[14px] backdrop-blur-[20px]
        shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[320px] max-w-[440px]
        ${isSuccess
          ? 'bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#6ee7b7]'
          : 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#fca5a5]'
        }
        ${isExiting ? 'animate-[toastSlideOut_0.3s_ease_forwards]' : 'animate-[toastSlideIn_0.4s_cubic-bezier(0.16,1,0.3,1)]'}
      `}
    >
      {isSuccess ? (
        <svg className="shrink-0 w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ) : (
        <svg className="shrink-0 w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      <span className="flex-1 text-[0.9rem] font-medium leading-[1.4]">{message}</span>
      <button
        className="shrink-0 bg-transparent border-none text-inherit cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-200 p-1"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: number) => void;
}

/**
 * Toast container manages multiple toasts
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
