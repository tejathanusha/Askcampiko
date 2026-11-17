import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import {
  readPreferences,
  savePreferences,
} from "../data/appPreferences";
import { LanguageProvider } from "../contexts/LanguageProvider";

function DashboardLayout({
  user,
  role = "student",
  activePage = "home",
  pageTitle = "Home",
  children,
  onNavigate,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [preferences, setPreferences] = useState(() =>
    readPreferences(user?.id)
  );

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.darkMode
      ? "dark"
      : "light";
    document.documentElement.lang =
      preferences.language === "Tamil"
        ? "ta"
        : preferences.language === "Telugu"
          ? "te"
          : "en";
  }, [preferences.darkMode, preferences.language]);

  const handlePreferencesChange = (nextPreferences) => {
    const error = savePreferences(user?.id, nextPreferences);
    if (error) {
      console.error("Unable to save Ask Campiko preferences.", error);
      return false;
    }

    setPreferences(nextPreferences);
    return true;
  };

  const handleNavigate = (page, assignmentId = null) => {
    if (onNavigate) {
      onNavigate(page, assignmentId);
    }

    setSidebarOpen(false);
  };

  const requestAssistantFocus = (prompt = "") => {
    window.dispatchEvent(
      new CustomEvent("askCampikoOpenAssistant", {
        detail: { prompt },
      })
    );
  };

  return (
    <LanguageProvider language={preferences.language}>
      <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar
        role={role}
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        onNeedHelp={requestAssistantFocus}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="dashboard-main">
        <TopBar
          user={user}
          role={role}
          pageTitle={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          preferences={preferences}
        />

        <main className="dashboard-content">
          {typeof children === "function"
            ? children({
                preferences,
                onPreferencesChange: handlePreferencesChange,
                onRequestHelp: requestAssistantFocus,
              })
            : children}
        </main>
      </div>
      </div>
    </LanguageProvider>
  );
}

export default DashboardLayout;