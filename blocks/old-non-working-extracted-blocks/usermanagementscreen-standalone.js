/**
 * UserManagementScreen Component
 * Props: { users?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useEffect, useState  } from 'https://esm.sh/react@18';
import { Users, UserX } from 'lucide-react';

interface User {
  email: string;
  passwordHash: string;
  role: 'customer' | 'mechanic' | 'admin';
  profileComplete: boolean;
  profileData?: any;
}

const UserManagementScreen = ({
  users,
  onUserUpdate,
  onUserRemoval,
  onBack,
  triggerToast
}: {
  users: User[];
  onUserUpdate: (user: User) => void;
  onUserRemoval: (email: string) => void;
  onBack: () => void;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleApproveMechanic = (user: User) => {
    if (user.role === 'mechanic' && !user.profileComplete) {
      const updatedUser = { ...user, profileComplete: true };
      onUserUpdate(updatedUser);
      triggerToast(`Mechanic ${user.email.split('@')[0]}'s profile approved!`, 'success');
    } else if (user.role !== 'mechanic') {
      triggerToast('Only mechanic profiles can be approved.', 'error');
    } else {
      triggerToast('Mechanic profile is already complete.', 'info');
    }
  };

  const handleRemoveUser = (email: string) => {
    if (confirm(`Are you sure you want to remove user ${email}?`)) {
      onUserRemoval(email);
      triggerToast(`User ${email.split('@')[0]} removed.`, 'info');
    }
  };

  const renderSkeletons = () => (
    <Card>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-3 md:space-y-0">
            <div className="flex-grow space-y-2">
              createElement('Skeleton', {className: 'h-4 w-40'})
              createElement('Skeleton', {className: 'h-3 w-24'})
              createElement('Skeleton', {className: 'h-3 w-28'})
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              createElement('Skeleton', {className: 'h-9 w-28'})
              createElement('Skeleton', {className: 'h-9 w-24'})
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return createElement('div', {className: 'flex flex-col items-stretch p-0 w-full h-full overflow-y-auto'}, 'createElement('HeaderBar', {title: 'User Management'})

      <div className="w-full max-w-2xl mx-auto space-y-4 px-4 py-4">
        {isLoading ? (
          renderSkeletons()
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1">
              createElement('Users', {className: 'text-slate-500'})
            </div>
            createElement('p', {className: 'font-medium text-slate-200'}, 'No users found')
            createElement('p', {className: 'text-sm max-w-sm'}, 'New customers and mechanics will appear here as they register in the app.')') : (
          <Card>
            <div className="space-y-4 animate-[fadeIn_220ms_ease-out]">
              {users.map((user) => (
                <div
                  key={user.email}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-800/80 rounded-lg shadow-sm border border-slate-700"
                >
                  <div className="flex-grow mb-2 md:mb-0">
                    createElement('p', {className: 'text-lg font-semibold text-white break-all'}, '{user.email}')
                    <p className="text-slate-300 text-sm">Role: createElement('span', {className: 'capitalize'}, '{user.role}')</p>
                    createElement('p', {className: 'text-slate-300 text-sm'}, 'Profile: {user.profileComplete ? 'Complete' : 'Incomplete'}')
                    {user.role === 'mechanic' && user.profileData?.services && (
                      createElement('p', {className: 'text-slate-400 text-xs mt-1'}, 'Services: {user.profileData.services.join(', ')}')
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                    {user.role === 'mechanic' && !user.profileComplete && (
                      createElement('button', null, 'handleApproveMechanic(user)}
                        className="w-full md:w-auto px-3 py-2 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[40px]"
                      >
                        Approve Mechanic')
                    )}
                    <button
                      onClick={() => handleRemoveUser(user.email)}
                      className="w-full md:w-auto px-3 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 min-h-[40px] flex items-center justify-center"
                    >
                      createElement('UserX', {className: 'mr-1'}) Remove User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagementScreen;
