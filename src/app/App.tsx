import { useState, useEffect } from "react";
import { AppProvider, useApp } from "../context/AppContext";
import { Header } from "./components/Header";
import { HarvestCard } from "./components/HarvestCard";
import { ReferralTree } from "./components/ReferralTree";
import { WalletCard } from "./components/WalletCard";
import { BottomNav } from "./components/BottomNav";
import { TasksSection } from "./components/TasksSection";
import { EarnProjects } from "./components/EarnProjects";
import { BoosterLevels } from "./components/BoosterLevels";
import { UserProfile } from "./components/UserProfile";
import { Notifications } from "./components/Notifications";
import { ShareReferral } from "./components/ShareReferral";
import { Deposit } from "./components/Deposit";
import { Withdraw } from "./components/Withdraw";
import { WithdrawalNotification } from "./components/WithdrawalNotification";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { VerifyEmail } from "./components/auth/VerifyEmail";
import {
  LandingNavbar,
  LandingFooter,
} from "./components/LandingUI";
import {
  MarketingHome,
  MarketingAbout,
  MarketingEarn,
  MarketingSupport,
} from "./components/MarketingPages";
import {
  HowItWorksPage,
  SecurityPage,
  CareersPage,
  HelpCenterPage,
  FAQPage,
  APIDocsPage,
  CommunityPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  CookiePolicyPage,
  RiskDisclaimerPage,
} from "./components/ContentPages";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { Search, Bell, Settings, User } from "lucide-react";

function DashboardContent() {
  const { user, isAuthenticated, logout, refreshAll } =
    useApp();

  const [activeTab, setActiveTab] = useState("home");
  const [currentScreen, setCurrentScreen] = useState<
    | "main"
    | "profile"
    | "notifications"
    | "shareReferral"
    | "deposit"
    | "withdraw"
  >("main");
  const [authScreen, setAuthScreen] = useState<
    "login" | "register" | "forgot" | "verify" | null
  >(null);
  const [landingPage, setLandingPage] = useState("home");
  const [userEmail, setUserEmail] = useState("");

  // Update userName from context user
  const userName = user?.name || "User";

  // Refresh all data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated]);

  // Auth handlers
  const handleLogin = () => {
    // AppContext already saved the token and set isAuthenticated to true!
    // We just need to hide the Auth screen so the Dashboard can render.
    setAuthScreen(null);
  };

  const handleRegister = (data: any) => {
    // According to Postman, register returns the new user.
    // Usually we redirect to login or auto-login.
    setAuthScreen("login");
  };

  const handleVerified = () => {
    setAuthScreen(null);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen("main");
    setLandingPage("home");
  };

  // 1. Show auth screens if active
  if (authScreen) {
    if (authScreen === "register") {
      return (
        <Register
          onRegister={handleRegister}
          onLogin={() => setAuthScreen("login")}
          onBack={() => setAuthScreen(null)}
        />
      );
    }

    if (authScreen === "forgot") {
      return (
        <ForgotPassword
          onBack={() => setAuthScreen("login")}
          onResetSent={() => setAuthScreen("login")}
        />
      );
    }

    if (authScreen === "verify") {
      return (
        <VerifyEmail
          email={userEmail}
          onVerified={handleVerified}
          onResend={() => {}}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setAuthScreen("register")}
        onForgotPassword={() => setAuthScreen("forgot")}
      />
    );
  }

  // 2. Show Marketing Landing Pages if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <LandingNavbar
          activePage={landingPage}
          setActivePage={setLandingPage}
          onLogin={() => setAuthScreen("login")}
          onRegister={() => setAuthScreen("register")}
        />

        <main className="flex-grow bg-slate-950">
          {landingPage === "home" && (
            <MarketingHome
              onLogin={() => setAuthScreen("login")}
              onRegister={() => setAuthScreen("register")}
            />
          )}
          {landingPage === "about" && <MarketingAbout />}
          {landingPage === "earn" && <MarketingEarn />}
          {landingPage === "support" && <MarketingSupport />}
          {landingPage === "how-it-works" && <HowItWorksPage />}
          {landingPage === "security" && <SecurityPage />}
          {landingPage === "careers" && <CareersPage />}
          {landingPage === "help-center" && <HelpCenterPage />}
          {landingPage === "faq" && <FAQPage />}
          {landingPage === "api-docs" && <APIDocsPage />}
          {landingPage === "community" && <CommunityPage />}
          {landingPage === "privacy" && <PrivacyPolicyPage />}
          {landingPage === "terms" && <TermsOfServicePage />}
          {landingPage === "cookies" && <CookiePolicyPage />}
          {landingPage === "risk-disclaimer" && (
            <RiskDisclaimerPage />
          )}
        </main>

        <LandingFooter onPageChange={setLandingPage} />
      </div>
    );
  }

  // 3. Show Dashboard UI if authenticated
  // Mobile views for special screens (Profile, Notifications, etc.)
  if (currentScreen === "profile") {
    return (
      <UserProfile
        user={user}
        onBack={() => setCurrentScreen("main")}
        onLogout={handleLogout}
        onShareReferral={() =>
          setCurrentScreen("shareReferral")
        }
      />
    );
  }

  if (currentScreen === "notifications") {
    return (
      <Notifications onBack={() => setCurrentScreen("main")} />
    );
  }

  if (currentScreen === "shareReferral") {
    return (
      <ShareReferral
        user={user}
        onBack={() => setCurrentScreen("main")}
      />
    );
  }

  if (currentScreen === "deposit") {
    return <Deposit onBack={() => setCurrentScreen("main")} />;
  }

  if (currentScreen === "withdraw") {
    return <Withdraw onBack={() => setCurrentScreen("main")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <WithdrawalNotification />

      <div className="flex h-screen overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <DesktopSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          onNotifications={() =>
            setCurrentScreen("notifications")
          }
          onProfile={() => setCurrentScreen("profile")}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden">
            <Header
              userName={userName}
              onBellClick={() =>
                setCurrentScreen("notifications")
              }
              onAvatarClick={() => setCurrentScreen("profile")}
            />
          </div>

          {/* Desktop Top Bar (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center justify-between px-10 py-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800/50">
            <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 w-96">
              <Search className="w-5 h-5 text-slate-500 mr-3" />
              <input
                type="text"
                placeholder="Search markets, assets, or projects..."
                className="bg-transparent text-slate-300 text-sm outline-none w-full"
              />
            </div>

            <div className="flex items-center space-x-6">
              <button className="relative p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900" />
              </button>
              <button className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-colors">
                <Settings className="w-5 h-5 text-slate-300" />
              </button>
              <div className="h-10 w-[1px] bg-slate-700/50" />
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setCurrentScreen("profile")}
              >
                <div className="text-right">
                  <p className="text-white text-sm font-bold">
                    {userName || "User"}
                  </p>
                  <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                    Verified Account
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center border border-white/20 shadow-lg shadow-cyan-500/20">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* APP CONTENT CONTAINER */}
          <div className="p-4 lg:p-10 lg:max-w-7xl lg:mx-auto w-full space-y-4 lg:space-y-8 pb-24 lg:pb-10">
            {/* Home Tab */}
            {activeTab === "home" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
                  <div className="lg:col-span-8 space-y-6">
                    <HarvestCard />

                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-[32px] p-6 lg:p-10 border border-slate-700/50 shadow-2xl">
                      <h3 className="text-white text-xl font-bold mb-6">
                        Recent Activity Monitor
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300 font-medium">
                              Daily Profit Tasks Progress
                            </span>
                            <button
                              onClick={() =>
                                setActiveTab("tasks")
                              }
                              className="text-cyan-400 text-sm font-bold hover:underline"
                            >
                              Open Tasks
                            </button>
                          </div>
                          <div className="bg-slate-800 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                              style={{ width: "40%" }}
                            />
                          </div>
                          <p className="text-slate-400 text-xs mt-3 flex justify-between">
                            <span>2 of 5 Tasks Completed</span>
                            <span className="text-emerald-400 font-bold">
                              +2.5 USDT Expected Reward
                            </span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">
                              Last Harvest
                            </p>
                            <p className="text-emerald-400 text-xl font-black">
                              +$51.45 USDT
                            </p>
                            <p className="text-slate-600 text-[10px] mt-1">
                              Mar 24, 2026 • 14:22
                            </p>
                          </div>
                          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-1">
                              Referral Commission
                            </p>
                            <p className="text-cyan-400 text-xl font-black">
                              +$12.80 USDT
                            </p>
                            <p className="text-slate-600 text-[10px] mt-1">
                              Mar 25, 2026 • 09:15
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <div className="lg:sticky lg:top-32">
                      <WalletCard
                        onDeposit={() =>
                          setCurrentScreen("deposit")
                        }
                        onWithdraw={() =>
                          setCurrentScreen("withdraw")
                        }
                      />

                      <div className="mt-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4">
                        <p className="text-slate-400 text-xs mb-3 font-bold uppercase tracking-widest">
                          Network Status
                        </p>
                        <div className="flex items-center space-x-3 text-emerald-400 text-sm font-bold">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span>
                            TRON NETWORK: SECURE (12ms)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <TasksSection />
              </div>
            )}

            {activeTab === "earn" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4">
                    <BoosterLevels />
                  </div>
                  <div className="lg:col-span-8">
                    <EarnProjects />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "refer" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 lg:max-w-4xl lg:mx-auto">
                <ReferralTree
                  user={user}
                  onShareClick={() =>
                    setCurrentScreen("shareReferral")
                  }
                />
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 lg:max-w-4xl lg:mx-auto">
                <WalletCard
                  onDeposit={() => setCurrentScreen("deposit")}
                  onWithdraw={() =>
                    setCurrentScreen("withdraw")
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* MOBILE NAVIGATION BAR (Hidden on Desktop) */}
        <div className="lg:hidden">
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}