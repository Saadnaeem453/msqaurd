import { api, tokenStore, User } from "../lib/api";

export interface AuthSession {
  id: string;
  device_type: string;
  browser: string | null;
  operating_system: string | null;
  location: string | null;
  signed_in_at: string;
  last_activity_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  status: "active" | "revoked" | "expired" | string;
  current: boolean;
}

export const clearLocalAuthState = () => {
  tokenStore.clear();
  ["token", "user", "accountType", "onboardingCompleted", "initialLoaderShown", "verify"].forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const createLoginIdempotencyKey = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const authApi = {
  getOrganizationMemberships: () => api.get('/auth/organization-memberships', { successMessage: false, errorMessage: false }),
  signup: (body: {
    full_name: string;
    username: string;
    email: string;
    password: string;
    country?: string;
    phone?: string;
    address?: string;
  }) =>
    api.post('/auth/signup', body, {
      loadingMessage: 'Creating your account...',
      successMessage: 'Account created! Check your email for the verification code.',
    }),

  // Pass the same key again only when retrying this exact login request.
  signin: (body: { email: string; password: string }, idempotencyKey = createLoginIdempotencyKey()) =>
    api.post<{ user: User; token: string }>('/auth/signin', body, {
      loadingMessage: 'Signing in...',
      successMessage: 'Welcome back!',
      headers: { 'Idempotency-Key': idempotencyKey },
    }),

  googleLogin: (body: { idToken: string }, idempotencyKey = createLoginIdempotencyKey()) =>
    api.post<{ user: User; token: string }>('/auth/google', body, {
      loadingMessage: 'Signing in with Google...',
      successMessage: 'Welcome!',
      headers: { 'Idempotency-Key': idempotencyKey },
    }),

  appleLogin: (body: { idToken: string }, idempotencyKey = createLoginIdempotencyKey()) =>
    api.post<{ user: User; token: string }>('/auth/apple', body, {
      loadingMessage: 'Signing in with Apple...',
      successMessage: 'Welcome!',
      headers: { 'Idempotency-Key': idempotencyKey },
    }),

  verifyAccount: (body: { email: string; code: string }) =>
    api.post('/auth/account-verification', body, {
      loadingMessage: 'Verifying...',
      successMessage: 'Email verified! You are now logged in.',
    }),

  resendOtp: (email: string) =>
    api.post('/auth/resend-otp', { email }, {
      loadingMessage: 'Resending code...',
      successMessage: 'Verification code sent!',
    }),

  sendPasswordResetCode: (email: string) =>
    api.post('/auth/password-reset-code', { email }, {
      loadingMessage: 'Sending reset code...',
      successMessage: 'Password reset code sent to your email.',
    }),

  confirmOtp: (body: { email: string; code: string }) =>
    api.post('/auth/confirm-otp', body, {
      successMessage: false, 
    }),

  resetPassword: (body: { email: string; code: string; password: string }) =>
    api.post('/auth/reset-password', body, {
      loadingMessage: 'Resetting password...',
      successMessage: 'Password reset successfully. Please sign in.',
    }),

  changePassword: (body: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) =>
    api.post<{ token: string }>('/auth/change-password', body, {
      successMessage: false,
      errorMessage: false,
    }),

  getSessions: () =>
    api.get<AuthSession[]>('/auth/sessions', { successMessage: false, errorMessage: false }),

  revokeSession: (sessionId: string) =>
    api.delete<{ session_id: string; revoked: boolean; current: boolean }>(
      `/auth/sessions/${encodeURIComponent(sessionId)}`,
      { successMessage: false, errorMessage: false },
    ),

  logout: () =>
    api.post('/auth/logout', undefined, { successMessage: false, errorMessage: false }),

  validateToken: () =>
    api.get('/auth/validate-token', {
      successMessage: false,
      errorMessage: false,   
    }),

  getProfile: () =>
    api.get<User>('/auth/profile', {
      successMessage: false,
    }),

  updateProfile: (body: {
    full_name?: string;
    email?: string;
    username?: string;
    country?: string;
    phone?: string;
    address?: string;
    gender?: string;
    dob?: string;
    avatar_url?: string;
    current_password?: string;
    new_password?: string;
  }) =>
    api.post<User>('/auth/update-profile', body, {
      loadingMessage: 'Saving changes...',
      successMessage: 'Profile updated successfully.',
    }),
};
