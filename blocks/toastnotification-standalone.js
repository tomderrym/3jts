/**
 * ToastNotification Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  show: boolean;
  onClose: () => void;
}

const ToastNotification = ({ message, type, show, onClose }: ToastNotificationProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const typeClasses: Record<string, string> = {
    success: 'bg-green-600 border-green-700',
    error: 'bg-red-600 border-red-700',
    info: 'bg-blue-600 border-blue-700',
    warning: 'bg-yellow-600 border-yellow-700 text-slate-900'
  };

  const Icon = () => {
    switch (type) {
      case 'success':
        return createElement('CheckCircle', {className: 'mr-2'});
      case 'error':
        return createElement('XCircle', {className: 'mr-2'});
      case 'warning':
        return createElement('AlertTriangle', {className: 'mr-2'});
      case 'info':
      default:
        return createElement('Info', {className: 'mr-2'});
    }
  };

  if (!isVisible) return null;

  return createElement('div', {style: {{ bottom: 'env(safe-area-inset-bottom, 0px)' }}, '<div
        className={`p-4 rounded-lg shadow-xl text-white border flex items-center justify-between transition-all duration-300 transform min-h-[50px]
        ${typeClasses[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center mr-2">
          createElement('Icon', null)
          createElement('p', {className: 'text-sm font-semibold flex-1 break-words'}, '{message}')
        </div>
        <button
          onClick={onClose}
          className="ml-2 h-[40px] w-[40px] flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-white"
          aria-label="Close notification"
        >
          createElement('XCircle', null)
        </button>
      </div>');
};

export default ToastNotification;
