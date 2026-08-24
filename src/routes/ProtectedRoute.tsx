import { useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "../services/auth_service";
import { tokenStore } from "../lib/api";

interface ProtectedRouteProps {
  children: ReactNode;
}

const isOnboardingCompleted = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return localStorage.getItem("onboardingCompleted") === "true";
};

const isOrganizerAccount = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem("accountType") === "organizer";
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

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = tokenStore.get();

    if (!token) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }

    authApi
      .validateToken()
      .then((res) => {
        setIsAuthenticated(res.ok);
        if (!res.ok) {
          // Clear ALL auth data so PublicRoute doesn't redirect back
          tokenStore.clear();
          localStorage.removeItem("token");
          localStorage.removeItem("accountType");
          localStorage.removeItem("onboardingCompleted");
          localStorage.removeItem("user");
          localStorage.removeItem("initialLoaderShown");
          localStorage.removeItem("verify");
        }
      })
      .catch(() => {
        // Network error or unexpected failure — also clear to break loops
        tokenStore.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("accountType");
        localStorage.removeItem("onboardingCompleted");
        localStorage.removeItem("user");
        localStorage.removeItem("initialLoaderShown");
        localStorage.removeItem("verify");
        setIsAuthenticated(false);
      })
      .finally(() => setIsChecking(false));
  }, []);

  if (isChecking) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isEmailVerified() && !isOrganizerAccount() && location.pathname !== "/verify-email") {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (!isOnboardingCompleted() && !isOrganizerAccount() && location.pathname !== "/onboarding" && location.pathname !== "/verify-email") {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
