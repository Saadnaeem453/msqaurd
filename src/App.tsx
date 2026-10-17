import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useState, useEffect, ReactNode } from "react";

import DashboardLayout from "./pages/Attendee/DashboardLayout";

import Home from "./pages/Attendee/Home";
import Explore from "./pages/Attendee/Explore";
import CategoryPage from "./pages/Attendee/CategoryPage";

import MapView from "./pages/Attendee/MapView";
import EventDetailPage from "./pages/Attendee/EventDetailPage";
import EventReviewsPage from "./pages/Attendee/EventReviewsPage";
import ProfilePage from "./pages/Attendee/ProfilePage";
import EditProfilePage from "./pages/Attendee/EditProfilePage";
import WishlistPage from "./pages/Attendee/WishlistPage";
import NotificationsPage from "./pages/Attendee/NotificationsPage";
import MyTicketsPage from "./pages/Attendee/MyTicketsPage";
import SelectExperiencePage from "./pages/Attendee/SelectExperiencePage";
import CheckoutPage from "./pages/Attendee/CheckoutPage";
import PaymentSuccessPage from "./pages/Attendee/PaymentSuccessPage";
import PaymentCancelledPage from "./pages/Attendee/PaymentCancelledPage";

import Login from "./pages/LoginPage/Login";
import Signup from "./pages/SignupPage/Signup";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ForgetPassword from "./pages/Forget Password/ForgetPassword";
import ResetPassword from "./pages/Forget Password/ResetPassword";
import NewPassword from "./pages/Forget Password/NewPassword";
import SuccessMessage from "./pages/Forget Password/SuccessMessage";

import OnboardingPage from "./pages/Attendee/LocationPage/OnboardingPage";

import AdminDashboardLayout from "./pages/Admin/AdminDashboardLayout";
import SystemOverview from "./pages/Admin/SystemOverview";
import LiveActivity from "./pages/Admin/LiveActivity";
import PlatformMetrics from "./pages/Admin/PlatformMetrics";
import AdminLogin from "./pages/Admin/AdminLogin";
import AllUsers from "./pages/Admin/AllUsers";
import Attendees from "./pages/Admin/Attendees";

import OrganizerDashboardOverview from "./pages/Organizer/dashboard/OrganizerDashboardOverview";
import OrganizerDashboardLayout from "./pages/Organizer/dashboard/OrganizerDashboardLayout";
import CreateEvent from "./pages/Organizer/events/CreateEvent";
import EditEvent from "./pages/Organizer/events/EditEvent";
import EventList from "./pages/Organizer/events/EventList";
import EventDetail from "./pages/Organizer/events/EventDetail";
import DraftEvents from "./pages/Organizer/events/DraftEvents";
import PublishedEvents from "./pages/Organizer/events/PublishedEvents";
import AccountSettings from "./pages/Organizer/settings/AccountSettings";
import RevenuePage from "./pages/Organizer/finance/RevenuePage";
import TransactionsPage from "./pages/Organizer/finance/TransactionsPage";
import PayoutsPage from "./pages/Organizer/finance/PayoutsPage";
import AudienceInsights from "./pages/Organizer/analytics/AudienceInsights";
import EventPerformance from "./pages/Organizer/analytics/EventPerformance";
import TrendsPage from "./pages/Organizer/analytics/TrendsPage";
import ScannerPage from "./pages/Organizer/checkin/ScannerPage";
import LiveCheckinsPage from "./pages/Organizer/checkin/LiveCheckinsPage";
import OrganizationProfile from "./pages/Organizer/organization/OrganizationProfile";
import TeamPage from "./pages/Organizer/organization/TeamPage";
import BrandingPage from "./pages/Organizer/organization/BrandingPage";
import TicketSales from "./pages/Organizer/tickets/TicketSales";
import AttendeeList from "./pages/Organizer/tickets/AttendeeList";
import TicketTypes from "./pages/Organizer/tickets/TicketTypes";

import ProtectedRoute from "./routes/ProtectedRoute";
import HeroSection from "./components/landingpagecomponents/Herosection";
import LoadingScreen from "./components/landingpagecomponents/LoadingScreen";
import AttendeeLayout from "./pages/Attendee/DashboardLayout";
import DashboardOverview from "./pages/Attendee/DashboardOverview";
import OrganizersSegmentPage from "./pages/Admin/OrganizersSegmentPage";
import VerificationRequestsPage from "./pages/Admin/VerificationRequestsPage";
import SuspendedUsersPage from "./pages/Admin/SuspendedUsersPage";
import NotFound from "./pages/NotFound";
import LivePublishedEventsPage from "./pages/Admin/events/LivePublishedEventsPage";
import PendingApprovalPage from "./pages/Admin/events/PendingApprovalPage";
import EventsDirectoryPage from "./pages/Admin/events/EventsDirectoryPage";
import ReportedEventsQueuePage from "./pages/Admin/events/ReportedEventsQueuePage";
import RejectedEventsArchivePage from "./pages/Admin/events/RejectedEventsArchivePage";
import ModerationEventReportPage from "./pages/Admin/moderation/EventReportPage";
import ComplaintManagementPage from "./pages/Admin/moderation/ComplaintManagementPage";
import MediaModerationQueuePage from "./pages/Admin/moderation/MediaModerationQueuePage";
import BacklogOverviewPage from "./pages/Admin/moderation/BacklogOverviewPage";
import RevenueDashboardPage from "./pages/Admin/finance/RevenueDashboardPage";
import GlobalTransactionsLedgerPage from "./pages/Admin/finance/GlobalTransactionsLedgerPage";
import AdminPayoutsPage from "./pages/Admin/finance/PayoutsPage";
import RefundsAdjudicationPage from "./pages/Admin/finance/RefundsAdjudicationPage";
import EventsAnalyticsPage from "./pages/Admin/analytics/EventsAnalyticsPage";
import RevenueAnalyticsPage from "./pages/Admin/analytics/RevenueAnalyticsPage";
import UserAnalyticsPage from "./pages/Admin/analytics/UserAnalyticsPage";
import GrowthTrendsPage from "./pages/Admin/analytics/GrowthTrendsPage";
import PushNotificationsControlPage from "./pages/Admin/communications/PushNotificationsControlPage";
import EmailCampaignManagerPage from "./pages/Admin/communications/EmailCampaignManagerPage";
import AllOrganizationsDirectoryPage from "./pages/Admin/organizations/AllOrganizationsDirectoryPage";
import MasjidsDirectoryPage from "./pages/Admin/organizations/MasjidsDirectoryPage";
import IsocsDirectoryPage from "./pages/Admin/organizations/IsocsDirectoryPage";
import EventOrganizersPage from "./pages/Admin/organizations/EventOrganizersPage";
import OrganizationVerificationRequestsPage from "./pages/Admin/organizations/VerificationRequestsPage";
import EventCategoriesPage from "./pages/Admin/plateformSettings/EventCategoriesPage";
import EventTypeArchitectPage from "./pages/Admin/plateformSettings/EventTypeArchitectPage";
import PlatformAnnouncementsPage from "./pages/Admin/communications/PlatformAnnouncementsPage";
import TicketSettingsPage from "./pages/Admin/plateformSettings/TicketSettingsPage";
import PaymentInfrastructurePage from "./pages/Admin/plateformSettings/PaymentInfrastructurePage";
import NotificationEnginePage from "./pages/Admin/plateformSettings/NotificationEnginePage";
import AIRulesPage from "./pages/Admin/plateformSettings/AIRulesPage";
import AdminActivityLogs from "./pages/Admin/security/AdminActivityLogs";
import LoginHistoryPage from "./pages/Admin/security/LoginHistoryPage";
import AccessRolesPage from "./pages/Admin/security/AccessRolesPage";
import PermissionsMatrixPage from "./pages/Admin/security/PermissionsMatrixPage";
import ApiKeyManagementPage from "./pages/Admin/security/ApiKeyManagementPage";

const getStoredAccountType = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("accountType");
  return stored === "organizer" || stored === "attendee" || stored === "admin" ? stored : null;
};

interface RoleRouteProps {
  children: ReactNode;
  allowedRole: "attendee" | "organizer" | "admin";
}

const getDashboardRedirectPath = () => {
  if (typeof window === "undefined") return "/";

  const accountType = getStoredAccountType();
  const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";

  if (!isEmailVerified() && accountType !== "admin") {
    return "/verify-email";
  }

  if (accountType === "admin") {
    return "/admin";
  }

  if (accountType === "organizer") {
    return "/organizer";
  }

  if (accountType === "attendee") {
    return onboardingCompleted ? "/home" : "/onboarding";
  }

  return "/";
};

const isUserAuthenticated = () => {
  if (typeof window === "undefined") return false;

  return Boolean(
    localStorage.getItem("token") ||
      localStorage.getItem("mh_token")
  );
};

const isEmailVerified = () => {
  if (typeof window === "undefined") return true;

  try {
    const rawUser = localStorage.getItem("user");
    const parsedUser = rawUser ? JSON.parse(rawUser) : null;
    const storedVerify = localStorage.getItem("verify");

    if (storedVerify === "true") return true;
    if (storedVerify === "false") return false;

    return parsedUser?.email_verified === true;
  } catch {
    return true;
  }
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  if (isUserAuthenticated()) {
    if (!isEmailVerified()) {
      return <Navigate to="/verify-email" replace />;
    }

    return <Navigate to={getDashboardRedirectPath()} replace />;
  }

  return <>{children}</>;
};

const RoleRoute = ({ children, allowedRole }: RoleRouteProps) => {
  const accountType = getStoredAccountType();

  if (!accountType) {
    return <Navigate to="/login" replace />;
  }

  if (accountType !== allowedRole) {
    const ownDashboard =
      accountType === "admin" ? "/admin" :
      accountType === "organizer" ? "/organizer" : "/home";
    return <Navigate to={ownDashboard} replace />;
  }

  return <>{children}</>;
};

function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return localStorage.getItem("initialLoaderShown") !== "true";
  });

  useEffect(() => {
    if (localStorage.getItem("initialLoaderShown") === "true") {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      localStorage.setItem("initialLoaderShown", "true");
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>

        <Route path="/" element={<PublicRoute><HeroSection /></PublicRoute>} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        <Route path="forgetpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
        <Route path="resetpassword" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="newpassword" element={<PublicRoute><NewPassword /></PublicRoute>} />
        <Route path="successmessage" element={<PublicRoute><SuccessMessage /></PublicRoute>} />
        <Route path="admin-login" element={<AdminLogin />} />

        {/* Stripe hosted checkout return URLs (the backend uses these paths). */}
        <Route path="checkout/success" element={<PaymentSuccessPage />} />
        <Route path="checkout/cancelled" element={<PaymentCancelledPage />} />
        <Route path="checkout/canceled" element={<PaymentCancelledPage />} />
        <Route path="checkout/failure" element={<PaymentCancelledPage />} />

        <Route path="onboarding" element={<OnboardingPage />} />

        <Route
          path="home"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="attendee">
                <AttendeeLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />

          <Route path="explore" element={<Explore />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="map" element={<MapView />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/:id/plans" element={<SelectExperiencePage />} />
          <Route path="events/:id/checkout" element={<CheckoutPage />} />
          <Route path="events/:id/payment-success" element={<PaymentSuccessPage />} />
          <Route path="events/:id/payment-cancelled" element={<PaymentCancelledPage />} />
          <Route path="events/:id/reviews" element={<EventReviewsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />

          <Route path="tickets" element={<MyTicketsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="notifications" element={<NotificationsPage />} />

        </Route>

        <Route
          path="layout"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="attendee">
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<Home />} />

        </Route>

        <Route
          path="organizer"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="organizer">
                <OrganizerDashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<OrganizerDashboardOverview />} />
          <Route path="overview" element={<OrganizerDashboardOverview />} />
          <Route path="events" element={<EventList />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/drafts" element={<DraftEvents />} />
          <Route path="events/published" element={<PublishedEvents />} />
          <Route path="events/past" element={<EventList />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="events/:id/edit" element={<EditEvent />} />

          <Route path="tickets/sales" element={<TicketSales />} />
          <Route path="tickets/attendees" element={<AttendeeList />} />
          <Route path="tickets/types" element={<TicketTypes />} />
          <Route path="checkin/scanner" element={<ScannerPage />} />
          <Route path="checkin/live" element={<LiveCheckinsPage />} />
          <Route path="settings" element={<AccountSettings />} />

          <Route path="finance/revenue" element={<RevenuePage />} />
          <Route path="finance/transactions" element={<TransactionsPage />} />
          <Route path="finance/payouts" element={<PayoutsPage />} />

          <Route path="analytics/audience" element={<AudienceInsights />} />
          <Route path="analytics/performance" element={<EventPerformance />} />
          <Route path="analytics/trends" element={<TrendsPage />} />

          <Route path="organization/profile" element={<OrganizationProfile />} />
          <Route path="organization/team" element={<TeamPage />} />
          <Route path="organization/branding" element={<BrandingPage />} />

        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRole="admin">
                <AdminDashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<SystemOverview />} />
          <Route path="overview" element={<SystemOverview />} />
          <Route path="dashboard/live" element={<LiveActivity />} />
          <Route path="dashboard/metrics" element={<PlatformMetrics />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="users/organizers" element={<OrganizersSegmentPage />} />
          <Route path="users/verification" element={<VerificationRequestsPage />} />
          <Route path="users/suspended" element={<SuspendedUsersPage />} />

          <Route path="users/attendees" element={<Attendees />} />

          <Route path="users/roles" element={<NotFound />} />
          <Route path="events" element={<EventsDirectoryPage />} />
          <Route path="events/pending" element={<PendingApprovalPage />} />
          <Route path="events/published" element={<LivePublishedEventsPage />} />
          <Route path="events/reported" element={<ReportedEventsQueuePage />} />
          <Route path="events/rejected" element={<RejectedEventsArchivePage />} />
          <Route path="events/live" element={<Navigate to="/admin/events/published" replace />} />
          <Route path="events/flagged" element={<Navigate to="/admin/events/reported" replace />} />
          <Route path="moderation/event-reports" element={<ModerationEventReportPage />} />
          <Route path="moderation/reports" element={<ModerationEventReportPage />} />
          <Route path="moderation/user-reports" element={<ComplaintManagementPage />} />
          <Route path="moderation/queue" element={<BacklogOverviewPage />} />
          <Route path="moderation/content" element={<MediaModerationQueuePage />} />
          <Route path="moderation/disputes" element={<NotFound />} />
          <Route path="moderation/log" element={<NotFound />} />
          <Route path="finance" element={<RevenueDashboardPage />} />
          <Route path="finance/transactions" element={<GlobalTransactionsLedgerPage />} />
          <Route path="finance/payouts" element={<AdminPayoutsPage />} />
          <Route path="finance/refunds" element={<RefundsAdjudicationPage />} />
          <Route path="finance/tax" element={<NotFound />} />
          <Route path="analytics" element={<PlatformMetrics />} />
          <Route path="analytics/events" element={<EventsAnalyticsPage />} />
          <Route path="analytics/users" element={<UserAnalyticsPage />} />
          <Route path="analytics/revenue" element={<RevenueAnalyticsPage />} />
          <Route path="analytics/growth" element={<GrowthTrendsPage />} />
          <Route path="analytics/engagement" element={<NotFound />} />
          <Route path="analytics/demographics" element={<NotFound />} />
          <Route path="communications/broadcasts" element={<PlatformAnnouncementsPage />} />
          <Route path="communications/templates" element={<NotFound />} />
          <Route path="communications/push" element={<PushNotificationsControlPage />} />
          <Route path="communications/email" element={<EmailCampaignManagerPage />} />
          <Route path="organizations" element={<AllOrganizationsDirectoryPage />} />
          <Route path="organizations/masjids" element={<MasjidsDirectoryPage />} />
          <Route path="organizations/isocs" element={<IsocsDirectoryPage />} />
          <Route path="organizations/event-organizers" element={<EventOrganizersPage />} />
          <Route path="organizations/verification" element={<OrganizationVerificationRequestsPage />} />
          <Route path="organizations/partnerships" element={<NotFound />} />
          <Route path="settings" element={<NotFound />} />
          <Route path="settings/event-types" element={<EventCategoriesPage />} />
          <Route path="settings/event-type-architect" element={<EventTypeArchitectPage />} />
          <Route path="settings/plateform/categories" element={<EventCategoriesPage />} />
          <Route path="settings/plateform/event-types" element={<EventTypeArchitectPage />} />
          <Route path="settings/plateform/ticket-settings" element={<TicketSettingsPage />} />
          <Route path="settings/plateform/payment-infrastructure" element={<PaymentInfrastructurePage />} />
          <Route path="settings/plateform/notification-engine" element={<NotificationEnginePage />} />
          <Route path="settings/plateform/ai-rules" element={<AIRulesPage />} />
          {/* Security and logs */}
          <Route path="settings/security/activity" element={<AdminActivityLogs />} />
          <Route path="settings/security/login-history" element={<LoginHistoryPage />} />
          <Route path="settings/security/access-roles" element={<AccessRolesPage />} />
          <Route path="settings/security/permissions" element={<PermissionsMatrixPage />} />
          <Route path="settings/security/api-keys" element={<ApiKeyManagementPage />} />

          <Route path="settings/payment-settings" element={<NotFound />} />
          <Route path="settings/notification-settings" element={<NotFound />} />
          <Route path="settings/ai-rules" element={<NotFound />} />
          <Route path="settings/api-keys" element={<NotFound />} />
          <Route path="settings/features" element={<NotFound />} />
          <Route path="settings/integrations" element={<NotFound />} />
          <Route path="security" element={<LoginHistoryPage />} />
          <Route path="security/incidents" element={<NotFound />} />
          <Route path="security/compliance" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
