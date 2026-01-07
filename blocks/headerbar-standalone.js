import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

interface HeaderBarProps {
  title?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** Optional: when true, header becomes sticky at top of scroll container */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
  sticky?: boolean;
}

/**
 * HeaderBar
 *
 * Consistent top header with fixed height for mobile, safe tap targets, and
 * a centered title. Left and right slots can host back buttons, actions, etc.
 */
const HeaderBar: React.FC<HeaderBarProps> = ({ title, leftSlot, rightSlot, sticky }) => {
  return createElement('header', null, '<div className="flex items-center min-h-[50px] min-w-[44px]">
        {leftSlot ?? createElement('div', {className: 'w-6'}, '}')
      {title ? (
        createElement('h1', {className: 'text-xl md:text-2xl font-semibold text-white text-center flex-1 px-2 truncate'}, '{title}')
      ) : (
        createElement('div', {className: 'flex-1'})
      )}
      <div className="flex items-center justify-end min-h-[50px] min-w-[44px]">
        {rightSlot ?? createElement('div', {className: 'w-6'}, '}')');
};

export default HeaderBar;
