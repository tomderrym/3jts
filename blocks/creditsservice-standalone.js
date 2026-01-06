
// Shared API base for frontend services
const API_BASE = typeof window !== 'undefined'
  ? (window.location.origin.replace(/\/$/, '') + '/api')
  : '/api';

export interface CreditProfileDto {
  id: string;
  name: string;
  monthlyLimit: number;
}

export interface UsageEntryDto {
  id: string;
  profileId: string;
  date: string;
  tokens: number;
  description?: string;
}

export interface UsageQuery {
  page?: number;
  pageSize?: number;
  fromDate?: string; // ISO date (legacy client key)
  toDate?: string;   // ISO date (legacy client key)
  from?: string;     // ISO date (backend-aligned key)
  to?: string;       // ISO date (backend-aligned key)
  q?: string;        // description contains
}

export interface PaginatedUsage {
  items: UsageEntryDto[];
  page: number;
  pageSize: number;
  total: number;
}

function buildAuthHeaders() {
  // Real authentication (e.g., bearer token or session cookie) should be
  // attached here once a global auth mechanism is available. For now we
  // rely on cookies (via fetch credentials) and an explicit Accept header.
  const headers: Record<string, string> = { Accept: 'application/json' };
  return headers;
}

async function handleResponse(res: Response, fallbackMessage: string): Promise<any> {
  let body: any = null;
  try {
    body = await res.clone().json();
  } catch {
    // If the body is not JSON, we'll fall back to status text below.
  }

  if (res.ok) return body;

  // Prefer explicit error message from backend, if provided.
  // The real backend is expected to return a structured error envelope like:
  // { error?: string; message?: string; code?: string; details?: any }
  const backendMessage: string | undefined =
    typeof body?.error === 'string'
      ? body.error
      : typeof body?.message === 'string'
        ? body.message
        : undefined;

  if (res.status === 401 || res.status === 403) {
    throw new Error(backendMessage || 'You are not authorized to access credits data.');
  }

  throw new Error(backendMessage || `${fallbackMessage} (${res.status})`);
}

export default function CreditsService = {
  /**
   * List all credit profiles.
   * Backend endpoint (expected):
   * GET /api/credits/profiles -> CreditProfileDto[]
   */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
  async listProfiles(): Promise<CreditProfileDto[]> {
    const res = await fetch(`${API_BASE}/credits/profiles`, {
      method: 'GET',
      headers: buildAuthHeaders(),
      credentials: 'include',
    });

    const data = await handleResponse(res, 'Failed to load profiles');
    return Array.isArray(data) ? (data as CreditProfileDto[]) : [];
  },

  /**
   * Update the monthly limit for a profile.
   * Backend endpoint (expected):
   * PATCH /api/credits/profiles/:id
   * body: { monthlyLimit: number }
   * -> updated CreditProfileDto
   */
  async updateProfileLimit(profileId: string, monthlyLimit: number): Promise<CreditProfileDto> {
    const res = await fetch(`${API_BASE}/credits/profiles/${encodeURIComponent(profileId)}`, {
      method: 'PATCH',
      headers: {
        ...buildAuthHeaders(),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ monthlyLimit }),
    });

    const data = await handleResponse(res, 'Failed to update profile');
    return data as CreditProfileDto;
  },

  /**
   * Get usage for a given profile.
   * Backend endpoint (aligned):
   * GET /api/credits/profiles/:id/usage?page=&pageSize=&from=&to=&q=
   * -> { items: UsageEntryDto[], page: number, pageSize: number, total: number }
   *
   * We still accept fromDate/toDate from older callers but translate them to
   * backend-aligned from/to query params.
   */
  async getUsage(profileId: string, query: UsageQuery = {}): Promise<PaginatedUsage> {
    const params = new URLSearchParams();

    if (query.page !== undefined) params.set('page', String(query.page));
    if (query.pageSize !== undefined) params.set('pageSize', String(query.pageSize));

    const from = query.from ?? query.fromDate;
    const to = query.to ?? query.toDate;
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (query.q) params.set('q', query.q);

    const res = await fetch(
      `${API_BASE}/credits/profiles/${encodeURIComponent(profileId)}/usage?${params.toString()}`,
      {
        method: 'GET',
        headers: buildAuthHeaders(),
        credentials: 'include',
      },
    );

    const data = await handleResponse(res, 'Failed to load usage');

    // With the real backend deployed, we now assume a well-formed payload and
    // surface any shape mismatches as errors instead of silently normalizing.
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid usage payload from server');
    }

    if (!Array.isArray((data as any).items)) {
      throw new Error('Usage payload missing items array');
    }

    const items = (data as any).items as UsageEntryDto[];
    const page = typeof (data as any).page === 'number' ? (data as any).page : 1;
    const pageSize = typeof (data as any).pageSize === 'number' ? (data as any).pageSize : 10;
    const total = typeof (data as any).total === 'number' ? (data as any).total : items.length;

    return { items, page, pageSize, total };
  },
};

// Shared SSE subscription helper for TaskRun updates
export type TaskRunEventHandler = (run: TaskRun) => void;

export function subscribeToTaskRunStream(onEvent: TaskRunEventHandler): () => void {
  if (typeof EventSource === 'undefined') {
    return () => {};
  }

  const url = `${API_BASE}/task-runs/stream`;
  const es = new EventSource(url, { withCredentials: true } as any);

  es.onmessage = (evt) => {
    if (!evt.data) return;
    try {
      const parsed = JSON.parse(evt.data);
      const run: TaskRun | undefined = parsed?.run ?? parsed;
      if (!run || !run.task_id || !run.model) return;
      onEvent(run);
    } catch {
      // ignore malformed
    }
  };

  es.onerror = () => {
    // allow browser auto-reconnect; more robust reconnection can be
    // implemented via a dedicated hook (useTaskRunStream).
  };

  return () => {
    es.close();
  };
}
