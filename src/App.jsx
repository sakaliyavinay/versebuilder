import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AppRouterProvider, useAppRouter } from "./router/Router";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BuilderPage } from "./pages/BuilderPage";
import { PublicPortfolioPage } from "./pages/PublicPortfolioPage";
import { AuthPage } from "./pages/AuthPage";

import "./styles/templates.css";
import "./styles/builder.css";
import "./styles/landing.css";
import "./styles/dashboard.css";

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
          <Analytics />
        </AppRouterProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
