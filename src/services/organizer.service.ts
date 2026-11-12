import { api } from "../lib/api";
import { createLoginIdempotencyKey } from "./auth_service";

export interface OrganizerSignupData {
  full_name: string;
  username: string;
  email: string;
  password: string;
  country?: string;
  phone?: string;
  address?: string;
  gender?: 'brother' | 'sister' | 'prefer_not_to_say';
  dob?: string;
  job_title?: string;
  bio?: string;
  preferred_language?: string;
  timezone?: string;
  organization_name?: string;
  organization_type?: 'masjid' | 'isoc' | 'event_organizer' | 'brand' | 'community';
}

export interface OrganizerSigninData {
  email: string;
  password: string;
}

export interface UpdateOrganizerProfileData {
  full_name?: string;
  username?: string;
  email?: string;
  country?: string;
  phone?: string;
  address?: string;
  gender?: 'brother' | 'sister' | 'prefer_not_to_say';
  dob?: string;
  avatar_url?: string;
  job_title?: string;
  bio?: string;
  preferred_language?: string;
  timezone?: string;
  current_password?: string;
  new_password?: string;
}

export interface ConvertToOrganizerData {
  job_title?: string;
  bio?: string;
  preferred_language?: string;
  timezone?: string;
  organization_name?: string;
  organization_type?: 'masjid' | 'isoc' | 'event_organizer' | 'brand' | 'community';
}

export interface OrganizationData {
  id: string;
  name: string;
  type: string;
  description?: string;
  logo_url?: string;
  website?: string;
  access_role?: OrganizationMemberRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  banner_url?: string;
  established_date?: string;
  focus_areas?: string[];
  legal_status?: string;
  social_links?: { instagram?: string; facebook?: string; twitter?: string; threads?: string; linkedin?: string; [key: string]: unknown };
}

export interface CreateOrganizationData {
  name: string;
  type?: 'masjid' | 'isoc' | 'event_organizer' | 'brand' | 'community';
  description?: string;
  logo_url?: string;
  website?: string;
  social_links?: any;
}

export interface UpdateOrganizationData {
  name?: string;
  description?: string;
  logo_url?: string;
  website?: string;
  social_links?: { instagram?: string; facebook?: string; twitter?: string; threads?: string; linkedin?: string; [key: string]: unknown };
  banner_url?: string;
  established_date?: string;
  focus_areas?: string[];
  legal_status?: string;
  is_active?: boolean;
}

export type OrganizationMemberRole = 'owner' | 'admin' | 'moderator';

export interface OrganizationMember {
  id: string;
  user_id?: string;
  user?: { id: string; full_name?: string; email?: string; avatar_url?: string | null };
  full_name?: string;
  name?: string;
  email: string;
  avatar_url?: string | null;
  role: OrganizationMemberRole;
  is_active: boolean;
  created_at?: string;
}

export interface OrganizationMembersResponse {
  members: OrganizationMember[];
  total?: number;
}

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: Exclude<OrganizationMemberRole, "owner">;
  expires_at: string;
  created_at: string;
}

export interface InvitationValidation {
  organization: { id: string; name: string };
  email: string;
  role: Exclude<OrganizationMemberRole, "owner">;
  expires_at: string;
}

export interface OrganizerProfileResponse {
  success: boolean;
  data: {
    id: string;
    full_name: string;
    username: string;
    email: string;
    role: 'attendee' | 'organizer' | 'admin';
    country?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
    dob?: string;
    gender?: string;
    is_active: boolean;
    email_verified: boolean;
    last_login_at?: string;
    created_at: string;
    auth_provider: string;
    organizer_profile?: {
      id: string;
      user_id: string;
      job_title?: string;
      bio?: string;
      preferred_language?: string;
      timezone?: string;
      profile_completed: boolean;
      created_at: string;
      updated_at: string;
    };
    organizations?: OrganizationData[];
  };
  detail: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    profile: any;
    organizations: OrganizationData[];
    stats: {
      total_organizations: number;

    };
  };
  detail: string;
}

export interface OrganizationsResponse {
  success: boolean;
  data: OrganizationData[];
  detail: string;
}

export const organizerApi = {
  /**
   * Register a new organizer account
   */
  signup: (data: OrganizerSignupData) =>
    api.post<{ success: boolean; verify: boolean; detail: string }>(
      '/organizer/signup',
      data,
      {
        loadingMessage: 'Creating organizer account...',
        successMessage: 'Organizer account created! Please verify your email.',
      }
    ),

  /**
   * Sign in as an organizer
   */
  signin: (data: OrganizerSigninData, idempotencyKey = createLoginIdempotencyKey()) =>
    api.post<{ success: boolean; token: string; user: any; detail: string }>(
      '/organizer/signin',
      data,
      {
        loadingMessage: 'Signing in...',
        successMessage: 'Welcome back, Organizer!',
        headers: { 'Idempotency-Key': idempotencyKey },
      }
    ),

  /**
   * Get organizer profile
   */
  getProfile: () =>
    api.get<OrganizerProfileResponse>('/organizer/profile', {
      successMessage: false,
    }),

  /**
   * Update organizer profile
   */
  updateProfile: (data: UpdateOrganizerProfileData) =>
    api.put<OrganizerProfileResponse>('/organizer/profile', data, {
      loadingMessage: 'Updating profile...',
      successMessage: 'Organizer profile updated successfully!',
    }),

  /**
   * Convert attendee account to organizer
   */
  convertFromAttendee: (data: ConvertToOrganizerData) =>
    api.post<{ success: boolean; data: any; detail: string }>(
      '/organizer/convert',
      data,
      {
        loadingMessage: 'Converting to organizer...',
        successMessage: 'Successfully converted to organizer!',
      }
    ),

  /**
   * Get dashboard statistics
   */
  getDashboardStats: () =>
    api.get<DashboardStatsResponse>('/organizer/dashboard', {
      successMessage: false,
    }),

  /**
   * Get all organizations for the current organizer
   */
  getOrganizations: () =>
    api.get<OrganizationData[]>('/organizer/organizations', {
      successMessage: false,
      errorMessage: false,
    }),

  /**
   * Create a new organization
   */
  createOrganization: (data: CreateOrganizationData) =>
    api.post<OrganizationData>(
      '/organizer/organizations',
      data,
      {
        loadingMessage: 'Creating organization...',
        successMessage: 'Organization created successfully!',
      }
    ),

  /**
   * Update an organization
   */
  updateOrganization: (orgId: string, data: UpdateOrganizationData | FormData) =>
    api.put<OrganizationData>(
      `/organizer/organizations/${orgId}`,
      data,
      {
        loadingMessage: 'Updating organization...',
        successMessage: 'Organization updated successfully!',
        errorMessage: false,
      }
    ),

  getOrganization: (orgId: string) =>
    api.get<OrganizationData>(`/organizations/${encodeURIComponent(orgId)}`, { successMessage: false, errorMessage: false }),

  getMembers: (orgId: string) =>
    api.get<OrganizationMembersResponse | OrganizationMember[]>(`/organizer/organizations/${encodeURIComponent(orgId)}/members`, { successMessage: false, errorMessage: false }),

  addMember: (orgId: string, data: { email: string; role: Exclude<OrganizationMemberRole, 'owner'> }) =>
    api.post<OrganizationMember>(`/organizer/organizations/${encodeURIComponent(orgId)}/members`, data, { loadingMessage: 'Adding member...', successMessage: 'Member added successfully.', errorMessage: 'Failed to add member.' }),

  updateMember: (orgId: string, userId: string, data: { role?: Exclude<OrganizationMemberRole, 'owner'>; is_active?: boolean }) =>
    api.patch<OrganizationMember>(`/organizer/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`, data, { loadingMessage: 'Updating member...', successMessage: 'Member updated successfully.', errorMessage: 'Failed to update member.' }),

  removeMember: (orgId: string, userId: string) =>
    api.delete(`/organizer/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(userId)}`, { loadingMessage: 'Removing member...', successMessage: 'Member removed successfully.', errorMessage: 'Failed to remove member.' }),

  getInvitations: (orgId: string) => api.get<OrganizationInvitation[]>(`/organizer/organizations/${encodeURIComponent(orgId)}/invitations`, { successMessage: false, errorMessage: false }),

  inviteMember: (orgId: string, data: { email: string; role: Exclude<OrganizationMemberRole, 'owner'> }) =>
    api.post<OrganizationInvitation>(`/organizer/organizations/${encodeURIComponent(orgId)}/invitations`, data, { loadingMessage: 'Sending invitation...', successMessage: 'Invitation sent.', errorMessage: false }),

  resendInvitation: (orgId: string, invitationId: string) =>
    api.post<OrganizationInvitation>(`/organizer/organizations/${encodeURIComponent(orgId)}/invitations/${encodeURIComponent(invitationId)}/resend`, {}, { loadingMessage: 'Resending invitation...', successMessage: 'Invitation resent.', errorMessage: false }),

  cancelInvitation: (orgId: string, invitationId: string) =>
    api.delete(`/organizer/organizations/${encodeURIComponent(orgId)}/invitations/${encodeURIComponent(invitationId)}`, { loadingMessage: 'Cancelling invitation...', successMessage: 'Invitation cancelled.', errorMessage: false }),

  validateInvitation: (token: string) => api.get<InvitationValidation>('/organization-invitations/validate', { params: { token }, successMessage: false, errorMessage: false }),

  acceptInvitation: (token: string, data?: { full_name?: string; username?: string; password?: string }) => api.post<{ user_id: string; organization_id: string; role: Exclude<OrganizationMemberRole, 'owner'>; account_created?: boolean }>('/organization-invitations/accept', { token, ...data }, { loadingMessage: 'Accepting invitation...', successMessage: false, errorMessage: false }),
};
