import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <section aria-labelledby="not-found-heading" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-grayblue px-6 py-16 text-center text-bgray">
      <p className="font-jakarta text-6xl font-bold text-secondary">404</p>
      <h1 id="not-found-heading" className="font-jakarta text-2xl font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-secondary">The page you’re looking for doesn’t exist or isn’t available yet.</p>
      <Link to={isAdmin ? "/admin/overview" : "/"} className="mt-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-grayblue transition-colors hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary">
        {isAdmin ? "Back to overview" : "Back to home"}
      </Link>
    </section>
  );
};

export default NotFound;
