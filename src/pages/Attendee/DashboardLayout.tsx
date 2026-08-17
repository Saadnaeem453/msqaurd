import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Attendee/Navbar";
import Footer from "../../components/Attendee/Footer";

const isUserAreaRoute = (pathname: string) =>
  pathname.startsWith("/home/profile") ||
  pathname === "/home/wishlist" ||
  pathname === "/home/notifications" ||
  pathname === "/home/tickets";

const AttendeeLayout = () => {
  const { pathname } = useLocation();
  const showFooter = !isUserAreaRoute(pathname);

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col mx-auto w-full max-w-384">
        <main className="flex-1 app-container">
          <Outlet />
        </main>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default AttendeeLayout;
