/**
 * ProfileEditScreen Component
 * Props: { user?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { ArrowLeft, User, MapPin, Wrench } from 'lucide-react';

interface UserData {
  email: string;
  role: 'customer' | 'mechanic';
  profileData?: {
    name?: string;
    address?: string;
    services?: string[];
  };
  profileComplete?: boolean; // Added for explicit update
}

interface ProfileEditScreenProps {
  currentUser: UserData;
  userRole: 'customer' | 'mechanic';
  onProfileUpdate: (user: UserData) => void;
  onBack: () => void;
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ProfileEditScreen = ({
  currentUser,
  userRole,
  onProfileUpdate,
  onBack,
  triggerToast
}: ProfileEditScreenProps) => {
  const [name, setName] = useState(currentUser.profileData?.name || '');
  const [address, setAddress] = useState(currentUser.profileData?.address || '');
  const [services, setServices] = useState(currentUser.profileData?.services?.join(', ') || '');

  useEffect(() => {
    setName(currentUser.profileData?.name || '');
    setAddress(currentUser.profileData?.address || '');
    setServices(currentUser.profileData?.services?.join(', ') || '');
  }, [currentUser]);

  const handleSaveProfile = () => {
    if (!name.trim() || !address.trim()) {
      triggerToast('Name and Address are required.', 'error');
      return;
    }

    const updatedProfileData = {
      name: name.trim(),
      address: address.trim(),
      ...(userRole === 'mechanic' && {
        services: services
          .split(',')
          .map(s => s.trim())
          .filter(s => s)
      }),
    };

    const updatedUser: UserData = {
      ...currentUser,
      profileData: updatedProfileData,
      profileComplete: true,
    };

    onProfileUpdate(updatedUser);
    triggerToast('Profile updated successfully!', 'success');
    onBack();
  };

  return createElement('div', {className: 'flex flex-col w-full h-full bg-slate-950 text-white overflow-y-auto'}, '<HeaderBar
        title={`Edit ${userRole === 'customer' ? 'Customer' : 'Mechanic'} Profile`}
        leftSlot={(
          <button
            onClick={onBack}
            className="h-[50px] w-[50px] flex items-center justify-center text-indigo-400 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="Back"
          >
            createElement('ArrowLeft', null)
          </button>
        )}
        sticky
      />

      <div className="w-full max-w-sm mx-auto space-y-4 px-4 py-4">
        <Card>
          <div className="space-y-4 text-left">
            <div>
              createElement('label', {className: 'block text-slate-300 text-sm font-medium mb-1', htmlFor: 'name'}, 'Full Name')
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  placeholder="Your Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base pr-10"
                  required
                />
                createElement('User', {className: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'})
              </div>
            </div>

            <div>
              createElement('label', {className: 'block text-slate-300 text-sm font-medium mb-1', htmlFor: 'address'}, 'Address')
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  placeholder="Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base pr-10"
                  required
                />
                createElement('MapPin', {className: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'})
              </div>
            </div>

            {userRole === 'mechanic' && (
              <div>
                createElement('label', {className: 'block text-slate-300 text-sm font-medium mb-1', htmlFor: 'services'}, 'Services Offered (comma-separated)')
                <div className="relative">
                  createElement('textarea', {id: 'services', placeholder: 'e.g., Oil Change, Brakes, Diagnostics'}, 'setServices(e.target.value)}
                    rows={3}
                    className="w-full h-auto min-h-[80px] px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 text-base pr-10"
                  >')
                  createElement('Wrench', {className: 'absolute right-3 top-3 text-slate-400 pointer-events-none'})
                </div>')}

            createElement('PrimaryButton', {className: 'mt-2', onClick: handleSaveProfile}, 'Save Profile')
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEditScreen;
