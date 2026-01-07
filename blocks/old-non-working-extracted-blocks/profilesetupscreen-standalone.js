/**
 * ProfileSetupScreen Component
 * Props: { userRole?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState  } from 'https://esm.sh/react@18';

const ProfileSetupScreen = ({ userRole, onProfileSetupComplete }: { userRole: 'customer' | 'mechanic'; onProfileSetupComplete: (profileData: any) => void }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [services, setServices] = useState(''); // For mechanics

  const handleCompleteProfile = () => {
    const profileData =
      userRole === 'customer'
        ? { name: name.trim(), address: address.trim() }
        : { name: name.trim(), address: address.trim(), services: services.split(',').map(s => s.trim()) };
    console.log(`Setting up ${userRole} profile with:`, profileData);
    onProfileSetupComplete(profileData);
  };

  return createElement('div', {className: 'flex flex-col w-full h-full bg-slate-950 text-white'}, 'createElement('HeaderBar', null)

      <div className="flex flex-col items-center justify-center p-4 w-full h-full overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          <Card>
            <div className="flex flex-col items-center space-y-4">
              createElement('h2', {className: 'text-2xl font-bold text-white text-center'}, 'Tell us a bit about you')
              createElement('p', {className: 'text-slate-300 text-center text-sm'}, 'Just a few more details to get started.')

              <div className="w-full space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-14 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base"
                />

                {userRole === 'mechanic' && (
                  createElement('textarea', {placeholder: 'Services (e.g., Oil Change, Brakes, Diagnostics)'}, 'setServices(e.target.value)}
                    rows={3}
                    className="w-full h-auto min-h-[80px] px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base"
                  >')
                )}
              </div>

              createElement('PrimaryButton', {onClick: handleCompleteProfile}, 'Complete Profile')
            </div>
          </Card>
        </div>
      </div>');
};

export default ProfileSetupScreen;
