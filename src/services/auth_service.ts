import { api, User } from "../lib/api";

export const authApi = {
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

  signin: (body: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/signin', body, {
      loadingMessage: 'Signing in...',
      successMessage: 'Welcome back!',
    }),

  googleLogin: (body: { idToken: string }) =>
    api.post<{ user: User; token: string }>('/auth/google', body, {
      loadingMessage: 'Signing in with Google...',
      successMessage: 'Welcome!',
    }),

  appleLogin: (body: { idToken: string }) =>
    api.post<{ user: User; token: string }>('/auth/apple', body, {
      loadingMessage: 'Signing in with Apple...',
      successMessage: 'Welcome!',
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