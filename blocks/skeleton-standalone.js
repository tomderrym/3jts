/**
 * Skeleton Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React from 'https://esm.sh/react@18';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={[
        'animate-pulse rounded-lg bg-slate-700/70',
        className ?? 'h-4'
      ].join(' ')}
    />
  );
};

export default Skeleton;
