import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AppRouterProvider, useAppRouter } from "./router/Router";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BuilderPage } from "./pages/BuilderPage";
import { PublicPortfolioPage } from "./pages/PublicPortfolioPage";
import { AuthPage } from "./pages/AuthPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";
import { AcceptableUsePage } from "./pages/AcceptableUsePage";
import { CookieConsentBanner } from "./components/common/CookieConsentBanner";
import { AccountSettingsModal } from "./components/common/AccountSettingsModal";

import "./styles/templates.css";
import "./styles/builder.css";
import "./styles/landing.css";
import "./styles/dashboard.css";
import "./styles/legal.css";
import "./styles/customizer.css";

function AppContent() {
  const { currentRoute } = useAppRouter();

  switch (currentRoute.name) {
    case "landing":
      return <LandingPage />;

    case "dashboard":
      return <DashboardPage />;

    case "builder":
      return <BuilderPage />;

    case "public-portfolio":
      return <PublicPortfolioPage />;

    case "auth":
      return <AuthPage initialMode={currentRoute.mode || "login"} />;

    case "legal":
      switch (currentRoute.page) {
        case "privacy":
          return <PrivacyPolicyPage />;
        case "terms":
          return <TermsOfServicePage />;
        case "cookies":
          return <CookiePolicyPage />;
        case "acceptable-use":
          return <AcceptableUsePage />;
        default:
          return <LandingPage />;
      }

    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <AppRouterProvider>
          <AppContent />
          <AccountSettingsModal />
          <CookieConsentBanner />
          <Analytics />
        </AppRouterProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
