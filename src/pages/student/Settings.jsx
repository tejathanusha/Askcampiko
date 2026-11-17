import React, { useState } from "react";
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Smartphone,
  Mail,
  Lock,
  UserRound,
  X,
} from "lucide-react";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";
import { changeDemoPassword } from "../../data/demoCredentials";

function Settings({
  user,
  role = "student",
  onLogout,
  preferences,
  onPreferencesChange,
  onContactSupport,
}) {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const isTeacher = role === "teacher";
  const [saveError, setSaveError] = useState("");
  const [activePanel, setActivePanel] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const notifications = preferences?.campusNotifications ?? true;
  const emailNotifications = preferences?.emailNotifications ?? true;
  const darkMode = preferences?.darkMode ?? false;
  const selectedLanguage = preferences?.language ?? "English";

  const updatePreferences = (updates) => {
    setSaveError("");
    if (!onPreferencesChange?.({ ...preferences, ...updates })) {
      setSaveError("Your preferences could not be saved. Please try again.");
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 8) {
      setPasswordFeedback({
        type: "error",
        message: "Use at least 8 characters for the new password.",
      });
      return;
    }

    if (newPassword !== confirmedPassword) {
      setPasswordFeedback({
        type: "error",
        message: "The new passwords do not match.",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const changed = await changeDemoPassword(
        user.id,
        currentPassword,
        newPassword
      );
      if (!changed) {
        setPasswordFeedback({
          type: "error",
          message: "The current password is incorrect.",
        });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmedPassword("");
      setPasswordFeedback({
        type: "success",
        message: "Your demo password was changed for this browser.",
      });
    } catch (error) {
      console.error("Unable to change the demo password.", error);
      setPasswordFeedback({
        type: "error",
        message: error.message || "The demo password could not be changed.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openContactSupport = (
    prompt = "I need help with a campus support issue."
  ) => {
    setActivePanel(null);
    onContactSupport?.(prompt);
  };

  return (
    <div className="dashboard-page">

      {/* Page Header */}
      <section className="welcome-section">
        <div className="welcome-content">

          <div className="settings-page-icon">
            <UserRound size={30} />
          </div>

          <div>
            <p className="welcome-eyebrow">
              {t("ACCOUNT SETTINGS")}
            </p>

            <h1>
              {t("Settings")}
            </h1>

            <p>
              {t("Manage your account and application preferences.")}
            </p>
          </div>

        </div>
      </section>


      {/* Notifications */}
      <section className="dashboard-section">

        <div className="settings-section-heading">
          <div>
            <h2>{t("Notifications")}</h2>
            <p>
              {t("Control how you receive campus updates and alerts.")}
            </p>
          </div>

          <Bell size={20} />
        </div>


        <div className="settings-list">

          <div className="settings-item">

            <div className="settings-item-icon">
              <Bell size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Campus Notifications")}</strong>

              <span>
                {notifications
                  ? t("Receive important campus announcements and alerts.")
                  : t("Campus notifications are off.")}
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                notifications ? "settings-toggle-active" : ""
              }`}
              onClick={() =>
                updatePreferences({ campusNotifications: !notifications })
              }
              aria-label={`${t("Toggle")} ${t("Campus Notifications")}`}
              aria-pressed={notifications}
            >
              <span />
            </button>

          </div>


          <div className="settings-item">

            <div className="settings-item-icon">
              <Mail size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Email Notifications")}</strong>

              <span>
                {emailNotifications
                  ? t("Receive important updates through your registered email.")
                  : t("Email notifications are off.")}
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                emailNotifications
                  ? "settings-toggle-active"
                  : ""
              }`}
              onClick={() =>
                updatePreferences({
                  emailNotifications: !emailNotifications,
                })
              }
              aria-label={`${t("Toggle")} ${t("Email Notifications")}`}
              aria-pressed={emailNotifications}
            >
              <span />
            </button>

          </div>

        </div>

      </section>


      {/* Appearance */}
      <section className="dashboard-section">

        <div className="settings-section-heading">
          <div>
            <h2>{t("Appearance")}</h2>

            <p>
              {t("Customize how Ask Campiko looks on your device.")}
            </p>
          </div>

          {darkMode ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </div>


        <div className="settings-list">

          <div className="settings-item">

            <div className="settings-item-icon">
              {darkMode ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}
            </div>

            <div className="settings-item-content">
              <strong>{t("Dark Mode")}</strong>

              <span>
                {darkMode
                  ? t("Dark appearance is on.")
                  : t("Use a darker appearance for the application.")}
              </span>
            </div>

            <button
              type="button"
              className={`settings-toggle ${
                darkMode ? "settings-toggle-active" : ""
              }`}
              onClick={() => updatePreferences({ darkMode: !darkMode })}
              aria-label={`${t("Toggle")} ${t("Dark Mode")}`}
              aria-pressed={darkMode}
            >
              <span />
            </button>

          </div>


          <div className="settings-item">

            <div className="settings-item-icon">
              <Globe size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Language")}</strong>

              <span>
                {t("Select your preferred application language.")}
              </span>
            </div>

            <select
              className="settings-language-select"
              aria-label={t("Language")}
              value={selectedLanguage}
              onChange={(event) =>
                updatePreferences({ language: event.target.value })
              }
            >
              <option value="English">
                English
              </option>

              <option value="Tamil">
                Tamil
              </option>

              <option value="Telugu">
                Telugu
              </option>
            </select>

          </div>

        </div>

      </section>

      {saveError && (
        <p className="settings-save-error" role="alert">
          {t(saveError)}
        </p>
      )}

      {/* Account & Privacy */}
      <section className="dashboard-section">

        <div className="settings-section-heading">
          <div>
            <h2>{t("Account & Privacy")}</h2>

            <p>
              {t("Manage your account security and privacy preferences.")}
            </p>
          </div>

          <Shield size={20} />
        </div>


        <div className="settings-list">

          <button
            type="button"
            className="settings-action-item"
            onClick={() => {
              setActivePanel("password");
              setPasswordFeedback(null);
            }}
          >

            <div className="settings-item-icon">
              <Lock size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Password & Security")}</strong>

              <span>
                {t("Manage your account security settings.")}
              </span>
            </div>

            <ChevronRight size={19} />

          </button>


          <button
            type="button"
            className="settings-action-item"
            onClick={() => setActivePanel("privacy")}
          >

            <div className="settings-item-icon">
              <Shield size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Privacy")}</strong>

              <span>
                {t("Review your privacy and data preferences.")}
              </span>
            </div>

            <ChevronRight size={19} />

          </button>

        </div>

      </section>


      {/* Help & Support */}
      <section className="dashboard-section">

        <div className="settings-section-heading">
          <div>
            <h2>{t("Help & Support")}</h2>

            <p>
              {t("Get assistance when you need it.")}
            </p>
          </div>

          <HelpCircle size={20} />
        </div>


        <div className="settings-list">

          <button
            type="button"
            className="settings-action-item"
            onClick={() => setActivePanel("help")}
          >

            <div className="settings-item-icon">
              <HelpCircle size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Help Center")}</strong>

              <span>
                {t("Find answers to common questions.")}
              </span>
            </div>

            <ChevronRight size={19} />

          </button>


          <button
            type="button"
            className="settings-action-item"
            onClick={openContactSupport}
          >

            <div className="settings-item-icon">
              <Smartphone size={19} />
            </div>

            <div className="settings-item-content">
              <strong>{t("Contact Support")}</strong>

              <span>
                {t("Ask the in-app assistant for help.")}
              </span>
            </div>

            <ChevronRight size={19} />

          </button>

        </div>

      </section>

      {activePanel && (
        <div
          className="settings-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActivePanel(null);
            }
          }}
        >
          <section
            className="settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-dialog-title"
          >
            <div className="settings-dialog-header">
              <h2 id="settings-dialog-title">
                {t(
                  activePanel === "password"
                    ? "Password & Security"
                    : activePanel === "privacy"
                      ? "Privacy"
                      : "Help Center"
                )}
              </h2>
              <button
                type="button"
                className="settings-dialog-close"
                onClick={() => setActivePanel(null)}
                aria-label={t("Close")}
              >
                <X size={20} />
              </button>
            </div>

            {activePanel === "password" && (
              <>
                <p className="settings-security-notice" role="note">
                  {t(
                    "This is a demo-only password stored in this browser. It is not protected by a server. Do not use a real or reused password."
                  )}
                </p>
                <form
                  className="settings-password-form"
                  onSubmit={handlePasswordChange}
                >
                  <label>
                    {t("Current password")}
                    <input
                      type="password"
                      autoComplete="current-password"
                      required
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                    />
                  </label>
                  <label>
                    {t("New password")}
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                    />
                  </label>
                  <label>
                    {t("Confirm new password")}
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={confirmedPassword}
                      onChange={(event) =>
                        setConfirmedPassword(event.target.value)
                      }
                    />
                  </label>
                  {passwordFeedback && (
                    <p
                      className={`settings-dialog-feedback settings-dialog-feedback-${passwordFeedback.type}`}
                      role={passwordFeedback.type === "error" ? "alert" : "status"}
                    >
                      {t(passwordFeedback.message)}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="settings-dialog-primary"
                    disabled={isChangingPassword}
                  >
                    {t(isChangingPassword ? "Saving..." : "Change demo password")}
                  </button>
                </form>
              </>
            )}

            {activePanel === "privacy" && (
              <div className="settings-dialog-copy">
                <p>
                  {t(
                    "This demo stores preferences, leave requests, class attendance, assignments, and demo credentials in this browser's local storage."
                  )}
                </p>
                <p>
                  {t(
                    "There is no server account or privacy service connected. Do not enter sensitive personal information."
                  )}
                </p>
                <p>
                  {t(
                    "Clearing this browser's site data removes these locally saved demo items."
                  )}
                </p>
              </div>
            )}

            {activePanel === "help" && (
              <div className="settings-dialog-copy">
                <h3>{t("How can I find my schedule?")}</h3>
                <p>
                  {t(
                    isTeacher
                      ? "Open Time Table to see your daily classes, sections, and subjects."
                      : "Open Time Table from the menu, or ask the assistant about today's classes."
                  )}
                </p>
                <h3>
                  {t(isTeacher ? "How do I take attendance?" : "Where can I check fees or attendance?")}
                </h3>
                <p>
                  {t(
                    isTeacher
                      ? "Open Attendance, choose the class and date, mark each student, and save the register."
                      : "Open Billing or Attendance from the menu, or ask the assistant."
                  )}
                </p>
                <h3>
                  {t(isTeacher ? "How do I publish assignments?" : "How do I request leave or OD?")}
                </h3>
                <p>
                  {t(
                    isTeacher
                      ? "Open Assignments to choose a class, set the start and due dates, and track submissions."
                      : "Open Leave from the menu to submit a request and track its status."
                  )}
                </p>
                <button
                  type="button"
                  className="settings-dialog-primary"
                  onClick={() =>
                    openContactSupport(
                      `I need help finding information in the ${role} portal.`
                    )
                  }
                >
                  {t("Ask Campiko Assistant")}
                </button>
              </div>
            )}
          </section>
        </div>
      )}


      {/* Logout */}
      <section className="dashboard-section">

        <button
          type="button"
          className="settings-logout-button"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>{t("Log Out")}</span>
        </button>

      </section>

    </div>
  );
}

export default Settings;