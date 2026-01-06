/**
 * Icon Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
// Most Commonly Used Components - Complete Implementation
// Cards, Modals, Dropdowns, Inputs, Tabs

import { useState, useEffect, useRef, ReactNode } from 'react';
import { X, ChevronDown, Eye, EyeOff, Search, Mail, Lock, User, Calendar } from 'lucide-react';

// ==================== BUTTONS ====================

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false
}: ButtonProps) {
  const baseClasses = "rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100 bg-transparent"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// ==================== CARDS ====================

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false
}: CardProps) {
  const baseClasses = "rounded-lg transition-all";
  
  const variants = {
    default: "bg-white",
    bordered: "bg-white border border-gray-200",
    elevated: "bg-white shadow-md"
  };
  
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };
  
  const interactive = onClick ? "cursor-pointer" : "";
  const hoverEffect = (onClick || hoverable) ? "hover:shadow-lg" : "";
  
  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${interactive} ${hoverEffect} ${className}`}
    >
      {children}
    </div>
  );
}

// ==================== MODAL ====================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative bg-white rounded-lg shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && <h2 className="text-xl">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation Modal
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="sm"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant} 
            onClick={() => { 
              onConfirm(); 
              onClose(); 
            }}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="text-center py-4">
        <h3 className="mb-4">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  );
}

// ==================== DROPDOWN ====================

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
}

export function Dropdown({ trigger, children, align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute ${alignmentClasses[align]} mt-2 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ 
  children, 
  onClick,
  icon: Icon,
  variant = 'default',
  disabled = false
}: { 
  children: ReactNode; 
  onClick?: () => void;
  icon?: any;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}) {
  const variantClasses = variant === 'danger' 
    ? 'text-red-600 hover:bg-red-50' 
    : 'text-gray-700 hover:bg-gray-50';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses}`}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px bg-gray-200 my-1" />;
}

// ==================== SELECT ====================

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Dropdown
      trigger={
        <button 
          disabled={disabled}
          className={`w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      }
    >
      {options.map(option => (
        <DropdownItem
          key={option.value}
          onClick={() => {
            onChange(option.value);
            setIsOpen(false);
          }}
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}

// ==================== INPUT FIELDS ====================

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: any;
  className?: string;
  helperText?: string;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  helperText
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const inputClasses = `
    w-full px-4 py-2 rounded-lg border transition-all outline-none
    ${Icon ? 'pl-10' : ''}
    ${type === 'password' ? 'pr-10' : ''}
    ${error 
      ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
  `;

  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  disabled = false,
  required = false,
  className = '',
  helperText,
  maxLength
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  helperText?: string;
  maxLength?: number;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2 rounded-lg border transition-all outline-none resize-none
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      
      <div className="flex items-center justify-between mt-1">
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {maxLength && (
          <p className="text-sm text-gray-400 ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  description
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 cursor-pointer disabled:opacity-50"
      />
      <div className="flex-1">
        <span className={disabled ? 'text-gray-400' : 'text-gray-700'}>
          {label}
        </span>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </label>
  );
}

export function Radio({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  description
}: {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  description?: string;
}) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-4 h-4 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-200 cursor-pointer disabled:opacity-50"
      />
      <div className="flex-1">
        <span className={disabled ? 'text-gray-400' : 'text-gray-700'}>
          {label}
        </span>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </label>
  );
}

// ==================== TABS ====================

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: any;
  badge?: number;
}

export function Tabs({ 
  tabs,
  defaultTab,
  onChange
}: { 
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => {
            export default function Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                {Icon && <Icon size={18} />}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full
                    ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                  `}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="py-4">
        {activeContent}
      </div>
    </div>
  );
}
