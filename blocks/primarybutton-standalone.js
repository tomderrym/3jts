import React from 'https://esm.sh/react@18';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * PrimaryButton
 *
 * Standard primary action button with fixed height, full-width by default,
 * and consistent focus-visible and hover states for mobile and desktop.
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className, ...rest }) => {
  return (
    <button
      {...rest}
      className={[
        'w-full h-[52px] rounded-xl bg-indigo-600 text-white text-sm font-semibold',
        'shadow-md shadow-indigo-950/40',
        'transition-colors duration-150',
        'hover:bg-indigo-500 disabled:bg-indigo-800',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        className ?? ''
      ].join(' ')}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
