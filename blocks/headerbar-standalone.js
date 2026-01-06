import React from 'https://esm.sh/react@18';

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
  return (
    <header
      className={[
        'w-full flex items-center justify-between px-2 py-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur',
        sticky ? 'sticky top-0 z-10' : ''
      ].join(' ')}
    >
      <div className="flex items-center min-h-[50px] min-w-[44px]">
        {leftSlot ?? <div className="w-6" />}
      </div>
      {title ? (
        <h1 className="text-xl md:text-2xl font-semibold text-white text-center flex-1 px-2 truncate">
          {title}
        </h1>
      ) : (
        <div className="flex-1" />
      )}
      <div className="flex items-center justify-end min-h-[50px] min-w-[44px]">
        {rightSlot ?? <div className="w-6" />}
      </div>
    </header>
  );
};

export default HeaderBar;
