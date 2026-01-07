
// Shared API base for frontend services
const API_BASE = typeof window !== 'undefined'
  ? (window.location.origin.replace(/\/$/, '') + '/api')
  : '/api';

export interface SaveProfilePayload {
  id: string;
  name?: string;
  description?: string;
  chordTimeoutMs?: number;
  bindings: KeybindingProfile['bindings'];
  // profile-level default contexts
  defaultPanel?: KeybindingProfile['defaultPanel'];
  defaultModes?: KeybindingProfile['defaultModes'];
}

export interface KeybindingProfileSummary {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

export default function KeybindingProfilesService = {
  /**
   * List all profiles with basic metadata. Backend is expected to return an
   * array of { id, name, description?, isDefault? }.
   */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
  async listProfiles(): Promise<KeybindingProfileSummary[]> {
    const res = await fetch(`${API_BASE}/keybinding-profiles`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to list keybinding profiles (${res.status})`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((p: any) => ({
      id: String(p.id),
      name: String(p.name ?? 'Untitled'),
      description: typeof p.description === 'string' ? p.description : undefined,
      isDefault: Boolean(p.isDefault ?? false),
    }));
  },

  /**
   * Create a new profile. Backend should accept: { name, description? }
   * and return a full KeybindingProfile.
   */
  async createProfile(payload: { name: string; description?: string }): Promise<KeybindingProfile> {
    const res = await fetch(`${API_BASE}/keybinding-profiles`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create keybinding profile (${res.status})`);
    }

    const data = await res.json();
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid keybinding profile payload after create');
    }

    return {
      id: String(data.id),
      name: String(data.name ?? payload.name),
      description: typeof data.description === 'string' ? data.description : payload.description,
      chordTimeoutMs: Number(data.chordTimeoutMs ?? 600),
      bindings: Array.isArray(data.bindings) ? (data.bindings as KeybindingProfile['bindings']) : [],
      isDefault: Boolean(data.isDefault ?? false),
      defaultPanel: (data.defaultPanel as KeybindingProfile['defaultPanel']) ?? undefined,
      defaultModes: (data.defaultModes as KeybindingProfile['defaultModes']) ?? undefined,
    };
  },

  /**
   * Delete a profile by id.
   */
  async deleteProfile(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/keybinding-profiles/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete keybinding profile (${res.status})`);
    }
  },

  /**
   * Load a single profile by id. The backend is expected to return:
   * { id, name, description?, chordTimeoutMs, bindings: CommandBinding[], defaultPanel?, defaultModes?, isDefault? }
   */
  async getProfile(id: string): Promise<KeybindingProfile> {
    const res = await fetch(`${API_BASE}/keybinding-profiles/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to load keybinding profile (${res.status})`);
    }

    const data = await res.json();
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid keybinding profile payload');
    }

    return {
      id: String(data.id ?? id),
      name: String(data.name ?? 'Untitled'),
      description: typeof data.description === 'string' ? data.description : undefined,
      chordTimeoutMs: Number(data.chordTimeoutMs ?? 600),
      bindings: Array.isArray(data.bindings) ? (data.bindings as KeybindingProfile['bindings']) : [],
      isDefault: Boolean(data.isDefault ?? false),
      defaultPanel: (data.defaultPanel as KeybindingProfile['defaultPanel']) ?? undefined,
      defaultModes: (data.defaultModes as KeybindingProfile['defaultModes']) ?? undefined,
    };
  },

  /**
   * Convenience helper for the common "default" profile.
   */
  async getDefaultProfile(): Promise<KeybindingProfile> {
    const res = await fetch(`${API_BASE}/keybinding-profiles/default`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to load default keybinding profile (${res.status})`);
    }

    const data = await res.json();
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid default keybinding profile payload');
    }

    return {
      id: String(data.id ?? 'default'),
      name: String(data.name ?? 'Default'),
      description: typeof data.description === 'string' ? data.description : 'Default keybindings',
      chordTimeoutMs: Number(data.chordTimeoutMs ?? 600),
      bindings: Array.isArray(data.bindings) ? (data.bindings as KeybindingProfile['bindings']) : [],
      isDefault: true,
      defaultPanel: (data.defaultPanel as KeybindingProfile['defaultPanel']) ?? undefined,
      defaultModes: (data.defaultModes as KeybindingProfile['defaultModes']) ?? undefined,
    };
  },

  /**
   * Save an updated profile. The backend should accept a JSON body:
   * { name?, description?, chordTimeoutMs?, bindings, defaultPanel?, defaultModes? }
   * and return the updated profile with the same shape as getProfile.
   */
  async saveProfile(payload: SaveProfilePayload): Promise<KeybindingProfile> {
    const { id, ...body } = payload;
    const res = await fetch(`${API_BASE}/keybinding-profiles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to save keybinding profile (${res.status})`);
    }

    const data = await res.json();
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid keybinding profile payload after save');
    }

    return {
      id: String(data.id ?? id),
      name: String(data.name ?? body.name ?? 'Untitled'),
      description: typeof data.description === 'string' ? data.description : body.description,
      chordTimeoutMs: Number(data.chordTimeoutMs ?? body.chordTimeoutMs ?? 600),
      bindings: Array.isArray(data.bindings) ? (data.bindings as KeybindingProfile['bindings']) : body.bindings,
      isDefault: Boolean(data.isDefault ?? false),
      defaultPanel: (data.defaultPanel as KeybindingProfile['defaultPanel']) ?? body.defaultPanel,
      defaultModes: (data.defaultModes as KeybindingProfile['defaultModes']) ?? body.defaultModes,
    };
  },
};
