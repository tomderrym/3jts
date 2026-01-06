/**
 * ShareModal Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { X, Share2, Mail, User, Trash2, Loader2, Copy, Check, Link as LinkIcon, Users } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  ownerUserId: string;
  appName: string;
}

export default function ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appId,
  ownerUserId,
  appName,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [shares, setShares] = useState<any[]>([]);
  const [contributors, setContributors] = useState<any[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);
  const [loadingContributors, setLoadingContributors] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [loadingLink, setLoadingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && appId && ownerUserId) {
      loadShares();
      loadContributors();
      loadShareableLink();
    } else if (isOpen && (!appId || !ownerUserId)) {
      console.warn('ShareModal: Missing appId or ownerUserId', { appId, ownerUserId });
    }
  }, [isOpen, appId, ownerUserId]);

  const loadShares = async () => {
    if (!appId || !ownerUserId) {
      console.warn('Cannot load shares: missing appId or ownerUserId', { appId, ownerUserId });
      setLoadingShares(false);
      return;
    }

    setLoadingShares(true);
    const timeout = setTimeout(() => {
      console.warn('Load shares timeout');
      setLoadingShares(false);
    }, 10000); // 10 second timeout

    try {
      const appShares = await shareService.getAppShares(appId, ownerUserId);
      setShares(appShares || []);
    } catch (e: any) {
      console.error('Failed to load shares:', e);
      console.error('Error details:', {
        message: e?.message,
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
        appId,
        ownerUserId
      });
      setShares([]);
    } finally {
      clearTimeout(timeout);
      setLoadingShares(false);
    }
  };

  const loadContributors = async () => {
    if (!appId || !ownerUserId) {
      console.warn('Cannot load contributors: missing appId or ownerUserId', { appId, ownerUserId });
      setContributors([]);
      return;
    }

    setLoadingContributors(true);
    const timeout = setTimeout(() => {
      console.warn('Load contributors timeout');
      setLoadingContributors(false);
      setContributors([]);
    }, 10000); // 10 second timeout

    try {
      const contribs = await shareService.getContributors(appId, ownerUserId);
      setContributors(contribs || []);
    } catch (e: any) {
      console.error('Failed to load contributors:', e);
      console.error('Error details:', {
        message: e?.message,
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
        appId,
        ownerUserId
      });
      setContributors([]);
    } finally {
      clearTimeout(timeout);
      setLoadingContributors(false);
    }
  };

  const loadShareableLink = async () => {
    if (!appId || !ownerUserId) {
      console.warn('Cannot load shareable link: missing appId or ownerUserId', { appId, ownerUserId });
      setLoadingLink(false);
      return;
    }

    setLoadingLink(true);
    const timeout = setTimeout(() => {
      console.warn('Load shareable link timeout');
      setLoadingLink(false);
      setShareUrl('');
    }, 10000); // 10 second timeout

    try {
      const result = await shareService.getOrCreateShareableLink(appId, ownerUserId);
      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
      } else {
        console.error('Failed to get shareable link:', result.message);
        console.error('Result:', result);
        setShareUrl('');
      }
    } catch (e: any) {
      console.error('Failed to load shareable link:', e);
      console.error('Error details:', {
        message: e?.message,
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
        appId,
        ownerUserId
      });
      setShareUrl('');
    } finally {
      clearTimeout(timeout);
      setLoadingLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await shareService.shareAppWithUser(appId, ownerUserId, email.trim());
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setEmail('');
        loadShares(); // Refresh the list
        loadContributors(); // Refresh contributors list
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to share app' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    if (!window.confirm('Are you sure you want to remove this share?')) return;

    try {
      const result = await shareService.removeShare(appId, shareId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadShares(); // Refresh the list
        loadContributors(); // Refresh contributors list
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to remove share' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111114] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Share2 size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Share App</h2>
              <p className="text-xs text-slate-400">{appName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Shareable Link Section */}
          <div className="space-y-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon size={16} className="text-indigo-400" />
              <label className="block text-sm font-semibold text-indigo-300">
                Shareable Link
              </label>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Anyone with this link can become a contributor automatically when they visit it.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full pl-3 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-indigo-500/50"
                  placeholder={loadingLink ? 'Generating link...' : 'Shareable link will appear here'}
                />
                {shareUrl && (
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Copy link"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Share Form */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              Share with user (by email)
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleShare();
                    }
                  }}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleShare}
                disabled={loading || !email.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Share2 size={16} />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Contributors List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-300">Contributors</h3>
              </div>
              {loadingContributors && <Loader2 size={14} className="animate-spin text-slate-500" />}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {loadingContributors ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <Loader2 size={24} className="mx-auto mb-2 animate-spin opacity-50" />
                  <p>Loading contributors...</p>
                </div>
              ) : contributors.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <User size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No contributors yet</p>
                </div>
              ) : (
                contributors.map((contributor, idx) => (
                  <div
                    key={contributor.id || idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      contributor.is_owner
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-black/40 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        contributor.is_owner
                          ? 'bg-emerald-500/20'
                          : 'bg-indigo-500/20'
                      }`}>
                        <User size={14} className={contributor.is_owner ? 'text-emerald-400' : 'text-indigo-400'} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {contributor.email || 'Unknown user'}
                          {contributor.is_owner && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">
                          {contributor.role === 'contributor' ? 'Can edit' : contributor.role === 'viewer' ? 'View only' : 'Full access'} •{' '}
                          {contributor.shared_via === 'link' ? 'Via share link' : 'Via email'} •{' '}
                          {new Date(contributor.shared_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {!contributor.is_owner && (
                      <button
                        onClick={() => {
                          const share = shares.find(s => s.shared_with_email === contributor.email);
                          if (share) handleRemoveShare(share.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove contributor"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Shared Users List (Email Shares) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">Email Shares</h3>
              {loadingShares && <Loader2 size={14} className="animate-spin text-slate-500" />}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {shares.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <User size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No shares yet</p>
                  <p className="text-xs mt-1">Share this app with others using the form above</p>
                </div>
              ) : (
                shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {share.shared_with_email || 'Unknown user'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {share.access_level === 'view' ? 'View only' : 'Can edit'} •{' '}
                          {new Date(share.shared_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveShare(share.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove share"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20">
          <p className="text-xs text-slate-500 text-center">
            Shared users will be able to view this app when they sign in with the shared email.
          </p>
        </div>
      </div>
    </div>
  );
};

