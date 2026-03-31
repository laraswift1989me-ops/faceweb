import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layouts/MainLayout";
import { Home } from "./pages/Home";
import { Stake } from "./pages/Stake";
import { Refer } from "./pages/Refer";
import { Wallet } from "./pages/Wallet";
import { Tasks } from "./pages/Tasks";
import { Profile } from "./pages/Profile";
import { Notifications } from "./pages/Notifications";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Landing } from "./pages/Landing";

// Marketing/Content Pages
import {
  About, FAQ, Security, Legal, Terms, Privacy,
  RiskDisclaimer, CookiePolicy, APIDocs, Careers,
  Community, HelpCenter, Support
} from "./pages/marketing/MarketingPages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: Home },
      { path: "stake", Component: Stake },
      { path: "refer", Component: Refer },
      { path: "wallet", Component: Wallet },
      { path: "tasks", Component: Tasks },
      { path: "profile", Component: Profile },
      { path: "notifications", Component: Notifications },
      
      // Marketing
      { path: "about", Component: About },
      { path: "faq", Component: FAQ },
      { path: "security", Component: Security },
      { path: "legal", Component: Legal },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: Privacy },
      { path: "risk-disclaimer", Component: RiskDisclaimer },
      { path: "cookies", Component: CookiePolicy },
      { path: "api-docs", Component: APIDocs },
      { path: "careers", Component: Careers },
      { path: "community", Component: Community },
      { path: "help-center", Component: HelpCenter },
      { path: "support", Component: Support },
    ],
  },
]);
