import { useState } from "react";
import {
  Sparkles,
  Layout,
  Plus,
  User,
  LogOut,
  ChevronDown,
  Layers,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppRouter } from "../../router/Router";
import { openAccountSettings } from "../common/accountSettingsEvents";

export const PlatformNav = () => {
  const { user, logout } = useAuth();
  const { navigate, currentRoute } = useAppRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="platform-nav">
      <div className="platform-nav-container">
        {/* Brand */}
        <div className="platform-nav-brand" onClick={() => navigate("/")}>
          <div className="platform-logo-icon">
            <Sparkles size={18} />
          </div>
          <span className="platform-brand-text">VerseBuilder</span>
        </div>

        {/* Center Links */}
        <nav className="platform-nav-menu">
          <button
            className={`nav-link-btn ${currentRoute.name === "landing" ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            Home
          </button>
          {user && (
            <button
              className={`nav-link-btn ${currentRoute.name === "dashboard" ? "active" : ""}`}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          )}
        </nav>

        {/* Right User State */}
        <div className="platform-nav-right">
          {user ? (
            <div className="user-dropdown-wrapper">
              <button
                className="user-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-nav-avatar" />
                ) : (
                  <div className="user-nav-placeholder">{user.name?.charAt(0)}</div>
                )}
                <span className="user-nav-name">{user.name}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div
                  className="user-dropdown-menu"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="user-dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Layers size={15} />
                    <span>My Portfolios</span>
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      openAccountSettings();
                    }}
                  >
                    <Settings size={15} />
                    <span>Profile &amp; Account Settings</span>
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item danger"
                    onClick={logout}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <button
                className="btn-nav-login"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="btn-nav-signup"
                onClick={() => navigate("/signup")}
              >
                Sign Up Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
