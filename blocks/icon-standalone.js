/**
 * Icon Component

 */
# Custom Component Library Guide

Complete guide to building UI components with Tailwind CSS, the way I generate apps in Figma Make.

---

## 📋 Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Modals/Dialogs](#modals)
4. [Dropdowns](#dropdowns)
5. [Input Fields](#inputs)
6. [Tabs](#tabs)
7. [Tooltips](#tooltips)
8. [Badges](#badges)
9. [Avatars](#avatars)
10. [Loading Spinners](#spinners)
11. [Alerts/Notifications](#alerts)
12. [Navigation](#navigation)

---

## 🔘 Buttons

### Basic Button Component

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) {
  const baseClasses = "rounded transition-all duration-200 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100"
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
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
```

### Icon Button

```tsx
import { X } from 'lucide-react';

export default function IconButton({ 
  icon: Icon, 
  onClick, 
  variant = 'ghost',
  size = 'md',
  'aria-label': ariaLabel 
}: {
  icon: any;
  onClick?: () => void;
  variant?: 'ghost' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
}) {
  const baseClasses = "rounded-full transition-colors inline-flex items-center justify-center";
  
  const variants = {
    ghost: "hover:bg-gray-100 active:bg-gray-200 text-gray-700",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    danger: "hover:bg-red-50 text-red-500 hover:text-red-600"
  };
  
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      aria-label={ariaLabel}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
}
```

---

## 🎴 Cards

### Basic Card

```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  variant = 'default',
  padding = 'md',
  className = '',
  onClick 
}: CardProps) {
  const baseClasses = "rounded-lg transition-all";
  
  const variants = {
    default: "bg-white",
    bordered: "bg-white border border-gray-200",
    elevated: "bg-white shadow-lg hover:shadow-xl"
  };
  
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };
  
  const interactive = onClick ? "cursor-pointer hover:shadow-md" : "";
  
  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${paddings[padding]} ${interactive} ${className}`}
    >
      {children}
    </div>
  );
}
```

### Feature Card

```tsx
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description,
  iconColor = 'text-blue-500'
}: FeatureCardProps) {
  return (
    <Card variant="bordered" padding="lg" className="hover:border-blue-200 transition-colors">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`${iconColor} bg-blue-50 p-3 rounded-lg`}>
          <Icon size={32} />
        </div>
        <h3>{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );
}
```

### Product Card

```tsx
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  price: number;
  onAddToCart: () => void;
}

export function ProductCard({ image, title, price, onAddToCart }: ProductCardProps) {
  return (
    <Card variant="bordered" padding="none" className="overflow-hidden group">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-blue-600">${price.toFixed(2)}</span>
          <Button size="sm" onClick={onAddToCart}>
            <ShoppingCart size={16} />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

---

## 🪟 Modals

### Modal Component

```tsx
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}: ModalProps) {
  // Prevent scroll when modal is open
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

  // Close on escape key
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
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl w-full ${sizes[size]} m-4 max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200`}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && <h2>{title}</h2>}
            {showCloseButton && (
              <IconButton
                icon={X}
                onClick={onClose}
                variant="ghost"
                aria-label="Close modal"
              />
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Confirmation Modal

```tsx
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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <h3 className="mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

---

## 📋 Dropdowns

### Dropdown Menu

```tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute ${alignmentClasses} mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in duration-200`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ 
  children, 
  onClick,
  icon: Icon,
  variant = 'default'
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  icon?: any;
  variant?: 'default' | 'danger';
}) {
  const variantClasses = variant === 'danger' 
    ? 'text-red-600 hover:bg-red-50' 
    : 'text-gray-700 hover:bg-gray-50';

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${variantClasses}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
```

### Select Component

```tsx
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = ''
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Dropdown
      trigger={
        <button className={`w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-between ${className}`}>
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
```

---

## ✍️ Input Fields

### Text Input

```tsx
interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: any;
  className?: string;
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
  className = ''
}: InputProps) {
  const inputClasses = `
    w-full px-4 py-2 rounded-lg border transition-all
    ${Icon ? 'pl-10' : ''}
    ${error 
      ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    outline-none
  `;

  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-gray-700">
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
```

### Textarea

```tsx
export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  className = ''
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-gray-700">{label}</label>
      )}
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-2 rounded-lg border transition-all outline-none resize-none
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
```

### Checkbox

```tsx
export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-200 cursor-pointer"
      />
      <span className={disabled ? 'text-gray-400' : 'text-gray-700'}>
        {label}
      </span>
    </label>
  );
}
```

### Switch/Toggle

```tsx
export function Switch({
  checked,
  onChange,
  label,
  disabled = false
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`
          w-11 h-6 rounded-full transition-all
          ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-300'}
          peer-checked:bg-blue-500
        `}>
          <div className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `} />
        </div>
      </div>
      {label && (
        <span className={disabled ? 'text-gray-400' : 'text-gray-700'}>
          {label}
        </span>
      )}
    </label>
  );
}
```

---

## 📑 Tabs

```tsx
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: any;
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map(tab => {
            export default function Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 border-b-2 transition-all flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {Icon && <Icon size={16} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeContent}
      </div>
    </div>
  );
}
```

---

## 💬 Tooltips

```tsx
import { useState, useRef } from 'react';

export function Tooltip({
  children,
  content,
  position = 'top'
}: {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute ${positions[position]} z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded whitespace-nowrap animate-in fade-in zoom-in duration-200`}>
          {content}
          {/* Arrow */}
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}
```

---

I'll continue with the rest in the next file...
