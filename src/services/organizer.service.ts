import { api } from "../lib/api";

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
  social_links?: any;
  owner_id: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  social_links?: any;
  is_active?: boolean;
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
      // More stats will be added
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
  signin: (data: OrganizerSigninData) =>
    api.post<{ success: boolean; token: string; user: any; detail: string }>(
      '/organizer/signin',
      data,
      {
        loadingMessage: 'Signing in...',
        successMessage: 'Welcome back, Organizer!',
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
    api.get<OrganizationsResponse>('/organizer/organizations', {
      successMessage: false,
    }),

  /**
   * Create a new organization
   */
  createOrganization: (data: CreateOrganizationData) =>
    api.post<{ success: boolean; data: OrganizationData; detail: string }>(
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
  updateOrganization: (orgId: string, data: UpdateOrganizationData) =>
    api.put<{ success: boolean; data: OrganizationData; detail: string }>(
      `/organizer/organizations/${orgId}`,
      data,
      {
        loadingMessage: 'Updating organization...',
        successMessage: 'Organization updated successfully!',
      }
    ),
};