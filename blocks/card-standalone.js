import React from 'https://esm.sh/react@18';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Card
 *
 * Reusable card container with consistent radius, border, and background.
 * Does not impose layout beyond padding and visual styling.
 */
const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={[
        'bg-slate-900/70 border border-slate-800 rounded-2xl shadow-lg',
        'px-4 py-4',
        className ?? ''
      ].join(' ')}
    >
      {children}
    </div>
  );
};

export default Card;
