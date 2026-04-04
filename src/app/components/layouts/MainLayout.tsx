import { Outlet, useLocation, Navigate } from "react-router";
import { useApp } from "../../../context/AppContext";
import { Header } from "../Header";
import { DesktopSidebar } from "../DesktopSidebar";
import { BottomNav } from "../BottomNav";
import { LandingNavbar } from "../LandingNavbar";
import { LandingFooter } from "../LandingFooter";
import { WithdrawalNotification } from "../WithdrawalNotification";
import { PageLoader } from "../PageLoader";
import { AppDownloadBanner } from "../AppDownloadBanner";

export function MainLayout() {
  const { isAuthenticated, isBootstrapping } = useApp();
  const location = useLocation();
  
  // Show full-screen loader while the app checks localStorage and fetches initial data
  if (isBootstrapping) return <PageLoader />;

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isDashboardPage = [
    "/dashboard", "/stake", "/refer", "/wallet", "/tasks", "/profile", "/notifications", "/support-tickets", "/swiftcash", "/p2p"
  ].some(path => location.pathname === path || location.pathname.startsWith(path + "/"));

  // Redirect to dashboard if trying to access auth pages while authenticated
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to login if trying to access dashboard pages while not authenticated
  if (!isAuthenticated && isDashboardPage) {
    return <Navigate to="/login" replace />;
  }

  if (isDashboardPage) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#080d18] text-slate-800 dark:text-slate-200 transition-colors duration-200">
        <AppDownloadBanner />
        <WithdrawalNotification />
        <div className="flex h-screen overflow-hidden">
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-72 h-full">
            <DesktopSidebar />
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto">
            {/* Header (Different for mobile/desktop handled in component) */}
            <Header />

            {/* PAGE CONTENT */}
            <main className="p-4 lg:p-8 lg:max-w-7xl lg:mx-auto w-full pb-24 lg:pb-8">
              <Outlet />
            </main>
          </div>

          {/* MOBILE NAVIGATION */}
          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    );
  }

  // Landing/Marketing Layout
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <AppDownloadBanner />
      {!isAuthPage && <LandingNavbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <LandingFooter />}
    </div>
  );
}
