/**
 * ─────────────────────────────────────────────────────────────
 *  Madina House — Reusable API Utility
 *  Uses: fetch + sonner (toast notifications)
 *
 *  Install sonner:
 *    npm install sonner
 *
 *  Add <Toaster /> once in your root layout (e.g. layout.tsx or App.tsx):
 *    import { Toaster } from 'sonner'
 *    <Toaster position="top-right" richColors />
 * ─────────────────────────────────────────────────────────────
 */

import { toast } from 'sonner';

// ─── Environment ──────────────────────────────────────────────────────────────
// const BASE_URL = 'http://localhost:5000/api';
const BASE_URL = "https://msqaurd-backend.onrender.com/api";
// Exact signup endpoints used by the frontend:
// - http://localhost:5000/api/auth/signup
// - http://localhost:5000/api/organizer/signup


// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape every response from the Madina House backend follows */
export interface ApiResponse<T = unknown> {
  success: boolean;
  detail?: string;
  data?: T;
  token?: string;
  user?: User;
  verify?: boolean;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/** Result returned to the caller after toast handling */
export interface ApiResult<T = unknown> {
  success: any;
  ok: boolean;
  data?: T;
  token?: string;
  user?: User;
  verify?: boolean;
  detail?: string;
}

export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  country?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  dob?: string;
  gender?: string;
  is_active: boolean;
  email_verified?: boolean;
  onboarding_completed?: boolean;
  [key: string]: any;
  last_login_at?: string;
  created_at: string;
}

// ─── Toast config ─────────────────────────────────────────────────────────────

interface ToastOptions {
  /** Show a success toast on 2xx. Pass false to suppress. */
  successMessage?: string | false;
  /** Override the error toast message. Pass false to suppress. */
  errorMessage?: string | false;
  /** Show a loading toast while the request is in-flight */
  loadingMessage?: string;
}

// ─── Token storage ────────────────────────────────────────────────────────────

const TOKEN_KEY = 'mh_token';

export const tokenStore = {
  get: (): string | null =>
    typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,

  set: (token: string): void => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  },

  clear: (): void => {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
  },
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<TData = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: Record<string, unknown> | FormData,
  toastOptions: ToastOptions = {}
): Promise<ApiResult<TData>> {
  const { successMessage, errorMessage, loadingMessage } = toastOptions;

  // Optional loading toast — returns a toast ID we can dismiss later
  let loadingToastId: string | number | undefined;
  if (loadingMessage) {
    loadingToastId = toast.loading(loadingMessage);
  }

  // Build headers
  const headers: HeadersInit = {};
  const publicAuthRoutes = new Set([
    '/auth/signup',
    '/auth/signin',
    '/auth/google',
    '/auth/apple',
    '/auth/account-verification',
    '/auth/resend-otp',
    '/auth/password-reset-code',
    '/auth/confirm-otp',
    '/auth/reset-password',
    '/organizer/signup',
    '/organizer/signin',
  ]);

  const token = tokenStore.get();
  if (token && !publicAuthRoutes.has(endpoint)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies (not FormData)
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });

    // Dismiss loading toast as soon as we have a response
    if (loadingToastId !== undefined) toast.dismiss(loadingToastId);

    const json: ApiResponse<TData> = await res.json();

    // ── Success path ──────────────────────────────────────────
    const isSuccessResponse =
      res.ok &&
      (json.success !== false) &&
      (json.success === true || json.detail !== undefined || json.data !== undefined || json.token !== undefined || json.user !== undefined || json.verify !== undefined || res.status < 400);

    if (isSuccessResponse) {
      // Save token if the response includes one (login / verify)
      if (json.token) tokenStore.set(json.token);

      if (successMessage !== false) {
        toast.success(successMessage ?? json.detail ?? 'Success');
      }

      const responsePayload = json.data ?? json;

      return {
        success: true,
        ok: true,
        data: responsePayload,
        token: json.token,
        user: json.user,
        verify: json.verify,
        detail: json.detail,
      };
    }

    // ── Validation errors (422) ───────────────────────────────
    if (res.status === 422 && json.errors?.length) {
      const messages = json.errors.map((e) => `${e.field}: ${e.message}`).join('\n');
      if (errorMessage !== false) {
        toast.error(errorMessage ?? json.detail ?? 'Validation failed', {
          description: messages,
        });
      }
      return { success: false, ok: false, detail: json.detail };
    }

    // ── Auth errors → clear token ─────────────────────────────
if (res.status === 401) {
  tokenStore.clear();
  localStorage.removeItem("user");
  localStorage.removeItem("accountType");
  localStorage.removeItem("onboardingCompleted");

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.history.replaceState(null, "", "/login");
  }

  return { success: false, ok: false, detail: "Unauthorized" };
}
    // ── All other error responses ─────────────────────────────
    if (errorMessage !== false) {
      toast.error(errorMessage ?? json.detail ?? 'Something went wrong');
    }

    return { success: false, ok: false, detail: json.detail };
  } catch (err) {
    // Network / parse error
    if (loadingToastId !== undefined) toast.dismiss(loadingToastId);

    const message = err instanceof Error ? err.message : 'Network error';
    if (errorMessage !== false) {
      toast.error('Connection failed', { description: message });
    }

    return { success: false, ok: false, detail: message };
  }
}

// ─── Public API surface ───────────────────────────────────────────────────────

export const api = {
  get: <TData = unknown>(
    endpoint: string,
    toastOptionsOrParams?: ToastOptions | { params?: Record<string, any>; [key: string]: any },
    maybeToastOptions?: ToastOptions
  ): Promise<ApiResult<TData>> => {
    // Support both api.get(url, toastOptions) and api.get(url, { params, ...toastOptions })
    let toastOptions: ToastOptions | undefined;
    if (maybeToastOptions) {
      // api.get(url, { params: {...}, successMessage: false, ... }, toastOptions) — unusual but handle gracefully
      toastOptions = maybeToastOptions;
    } else if (toastOptionsOrParams && 'params' in toastOptionsOrParams) {
      const { params, ...rest } = toastOptionsOrParams as { params?: Record<string, any> } & ToastOptions;
      // Append query params to endpoint
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });
        const qs = searchParams.toString();
        if (qs) endpoint += (endpoint.includes('?') ? '&' : '?') + qs;
      }
      toastOptions = Object.keys(rest).length ? (rest as ToastOptions) : undefined;
    } else {
      toastOptions = toastOptionsOrParams as ToastOptions | undefined;
    }
    return request<TData>('GET', endpoint, undefined, toastOptions);
  },

  post: <TData = unknown>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    toastOptions?: ToastOptions
  ): Promise<ApiResult<TData>> =>
    request<TData>('POST', endpoint, body, toastOptions),

  put: <TData = unknown>(
    endpoint: string,
    body?: Record<string, unknown> | FormData,
    toastOptions?: ToastOptions
  ): Promise<ApiResult<TData>> =>
    request<TData>('PUT', endpoint, body, toastOptions),

  patch: <TData = unknown>(
    endpoint: string,
    body?: Record<string, unknown>,
    toastOptions?: ToastOptions
  ): Promise<ApiResult<TData>> =>
    request<TData>('PATCH', endpoint, body, toastOptions),

  delete: <TData = unknown>(
    endpoint: string,
    toastOptions?: ToastOptions
  ): Promise<ApiResult<TData>> =>
    request<TData>('DELETE', endpoint, undefined, toastOptions),

  /** Upload files — sends as FormData, no Content-Type override */
  upload: <TData = unknown>(
    endpoint: string,
    formData: FormData,
    toastOptions?: ToastOptions
  ): Promise<ApiResult<TData>> =>
    request<TData>('POST', endpoint, formData, toastOptions),
};

// ─── Pre-built auth calls (ready to use in components) ────────────────────────

