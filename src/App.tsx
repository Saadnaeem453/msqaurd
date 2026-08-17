// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useState, useEffect, ReactNode } from "react";

// ─── Layouts ────────────────────────────────────────────────
import DashboardLayout from "./pages/Attendee/DashboardLayout";        // old attendee dashboard (sidebar)

// ─── Attendee Pages ──────────────────────────────────────────
import Home from "./pages/Attendee/Home";                             // home page
import Explore from "./pages/Attendee/Explore";                       // explore page
import CategoryPage from "./pages/Attendee/CategoryPage";             // category page
// import Communities from "./pages/Attendee/Communities";           // placeholder – commented out
import MapView from "./pages/Attendee/MapView";                       // map view page
import EventDetailPage from "./pages/Attendee/EventDetailPage";       // event detail page
import EventReviewsPage from "./pages/Attendee/EventReviewsPage";     // event reviews page
import ProfilePage from "./pages/Attendee/ProfilePage";               // profile page
import EditProfilePage from "./pages/Attendee/EditProfilePage";       // edit profile page
import WishlistPage from "./pages/Attendee/WishlistPage";               // wishlist page
import NotificationsPage from "./pages/Attendee/NotificationsPage";     // notifications page
import MyTicketsPage from "./pages/Attendee/MyTicketsPage";             // my tickets page

// ─── Auth Pages ──────────────────────────────────────────────
import Login from "./pages/LoginPage/Login";
import Signup from "./pages/SignupPage/Signup";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ForgetPassword from "./pages/Forget Password/ForgetPassword";
import ResetPassword from "./pages/Forget Password/ResetPassword";
import NewPassword from "./pages/Forget Password/NewPassword";
import SuccessMessage from "./pages/Forget Password/SuccessMessage";

// ─── Onboarding ──────────────────────────────────────────────
import OnboardingPage from "./pages/Attendee/LocationPage/OnboardingPage";

// ─── Admin ───────────────────────────────────────────────────
import AdminDashboardLayout from "./pages/Admin/AdminDashboardLayout";
import SystemOverview from "./pages/Admin/SystemOverview";
import LiveActivity from "./pages/Admin/LiveActivity";
import PlatformMetrics from "./pages/Admin/PlatformMetrics";
import AdminLogin from "./pages/Admin/AdminLogin";
import AllUsers from "./pages/Admin/AllUsers";
import Attendees from "./pages/Admin/Attendees";

// ─── Organizer ───────────────────────────────────────────────
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
import OrganizationProfile from "./pages/Organizer/organization/OrganizationProfile";
import TeamPage from "./pages/Organizer/organization/TeamPage";
import BrandingPage from "./pages/Organizer/organization/BrandingPage";
import TicketSales from "./pages/Organizer/tickets/TicketSales";
import AttendeeList from "./pages/Organizer/tickets/AttendeeList";
import TicketTypes from "./pages/Organizer/tickets/TicketTypes";

// ─── Other ───────────────────────────────────────────────────
import ProtectedRoute from "./routes/ProtectedRoute";
import HeroSection from "./components/landingpagecomponents/Herosection";
import LoadingScreen from "./components/landingpagecomponents/LoadingScreen";
import AttendeeLayout from "./pages/Attendee/DashboardLayout";
import DashboardOverview from "./pages/Attendee/DashboardOverview";

// ─── Helpers ─────────────────────────────────────────────────
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
      localStorage.getItem("mh_token") ||
      localStorage.getItem("accountType")
  );
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  if (isUserAuthenticated()) {
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
    // Redirect to user's own dashboard, not the target role's dashboard
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
        {/* ─── Public Routes ──────────────────────────────── */}
        <Route path="/" element={<PublicRoute><HeroSection /></PublicRoute>} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
        <Route path="forgetpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>} />
        <Route path="resetpassword" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="newpassword" element={<PublicRoute><NewPassword /></PublicRoute>} />
        <Route path="successmessage" element={<PublicRoute><SuccessMessage /></PublicRoute>} />
        <Route path="admin-login" element={<AdminLogin />} />

        {/* ─── Onboarding (accessible after signup) ────── */}
        <Route path="onboarding" element={<OnboardingPage />} />

        {/* ─── Attendee Routes ───────────────────────────── */}
        {/* New layout with navbar + footer – only /home is active for now */}
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
          {/* Additional attendee pages */}
          <Route path="explore" element={<Explore />} />
          <Route path="category/:category" element={<CategoryPage />} />
          <Route path="map" element={<MapView />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/:id/reviews" element={<EventReviewsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          
          
          <Route path="tickets" element={<MyTicketsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          {/*
          <Route path="communities" element={<Communities />} />
          */}
        </Route>

        {/* Old attendee dashboard (sidebar) – kept for advanced features */}
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
          {/* other old attendee routes can be added here */}
        </Route>

        {/* ─── Organizer Routes ───────────────────────────── */}
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
          {/* Tickets */}
          <Route path="tickets/sales" element={<TicketSales />} />
          <Route path="tickets/attendees" element={<AttendeeList />} />
          <Route path="tickets/types" element={<TicketTypes />} />
          <Route path="settings" element={<AccountSettings />} />
          {/* Finance */}
          <Route path="finance/revenue" element={<RevenuePage />} />
          <Route path="finance/transactions" element={<TransactionsPage />} />
          <Route path="finance/payouts" element={<PayoutsPage />} />
          {/* Analytics */}
          <Route path="analytics/audience" element={<AudienceInsights />} />
          <Route path="analytics/performance" element={<EventPerformance />} />
          <Route path="analytics/trends" element={<TrendsPage />} />
          {/* Organization */}
          <Route path="organization/profile" element={<OrganizationProfile />} />
          <Route path="organization/team" element={<TeamPage />} />
          <Route path="organization/branding" element={<BrandingPage />} />
          {/* other organizer routes go here */}
        </Route>

        {/* ─── Admin Routes ────────────────────────────────── */}
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
          <Route path="users/attendees" element={<Attendees />} />
        </Route>

        {/* ─── Fallback ──────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;





