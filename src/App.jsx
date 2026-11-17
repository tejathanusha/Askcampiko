import React, { useState } from "react";

import DashboardLayout from "./pages/DashboardLayout";

// Student Pages
import StudentHome from "./pages/student/StudentHome";
import Timetable from "./pages/student/Timetable";
import Attendance from "./pages/student/Attendance";
import StudentEvents from "./pages/student/Events";
import AchievementHistory from "./pages/student/AchievementHistory";
import AssignmentDetails from "./pages/student/AssignmentDetails";
import TeachingContent from "./pages/student/TeachingContent";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";
import Billing from "./pages/student/Billing";
import Leave from "./pages/student/Leave";
import { verifyDemoPassword } from "./data/demoCredentials";

// Teacher Pages
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherTimetable from "./pages/teacher/Timetable";
import TeacherTeachingContent from "./pages/teacher/TeachingContent";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherProfile from "./pages/teacher/Profile";
import LeaveApproval from "./pages/teacher/LeaveApproval";

// Data
import { studentData, teacherData } from "./data/mockData";

// Styles
import "./styles/App.css";
import "./styles/theme.css";
import "./styles/dashboard.css";


// ==========================================
// DEMO AUTHENTICATION (TEMPORARY)
// ==========================================
// mockData.js has no password records yet, so this is a single shared
// password used ONLY so the login form has something to check against
// while the rest of the app is being built.
//
// This is NOT secure authentication. There is no hashing, no backend,
// and no real account verification. It must be replaced with a real
// authentication system (e.g. a backend + hashed passwords) before
// this app is ever used with real student/teacher data.
const DEMO_PASSWORD = "Campiko@123";


// ==========================================
// EYE ICONS (inline SVG - no extra package needed)
// ==========================================

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 6.27C3.73 7.9 2 10 1 12c0 0 4 7 11 7 2.09 0 3.9-.5 5.44-1.27M17.9 17.73C20.2 16.1 23 12 23 12s-1.08-1.9-3-3.73"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 4.5A10.9 10.9 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 2.98"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// ==========================================
// LOGIN PAGE
// ==========================================

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState(studentData.id);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setIdentifier(newRole === "student" ? studentData.id : teacherData.id);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedIdentifier = identifier.trim().toLowerCase();
    const enteredPassword = password;

    if (!trimmedIdentifier || !enteredPassword) {
      setError("Please enter both your ID/email and password.");
      return;
    }

    let matchedUser = null;

    if (role === "student") {
      const idMatch = studentData.id.toLowerCase() === trimmedIdentifier;
      const rollMatch =
        studentData.rollNumber.toLowerCase() === trimmedIdentifier;
      const emailMatch = studentData.email.toLowerCase() === trimmedIdentifier;

      if (idMatch || rollMatch || emailMatch) {
        matchedUser = studentData;
      }
    } else {
      const idMatch = teacherData.id.toLowerCase() === trimmedIdentifier;
      const emailMatch = teacherData.email.toLowerCase() === trimmedIdentifier;

      if (idMatch || emailMatch) {
        matchedUser = teacherData;
      }
    }

    if (!matchedUser) {
      setError(
        role === "student"
          ? "No student found with that ID, roll number or email."
          : "No teacher found with that faculty ID or email."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const passwordIsValid = await verifyDemoPassword(
        matchedUser.id,
        enteredPassword
      );
      if (!passwordIsValid) {
        setError("Incorrect password.");
        return;
      }

      setError("");
      onLogin(role);
    } catch (verificationError) {
      console.error("Unable to verify the demo password.", verificationError);
      setError("Password verification failed in this browser. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-icon">A</div>

          <div>
            <h1>Ask Campiko</h1>
            <p>Your campus. Your questions.</p>
          </div>
        </div>

        <div className="login-role-section">
          <h2>Welcome Back</h2>
          <p>Select your role to continue</p>

          <div className="role-selector">

            <button
              type="button"
              className={`role-button ${
                role === "student" ? "role-button-active" : ""
              }`}
              onClick={() => handleRoleChange("student")}
            >
              Student
            </button>

            <button
              type="button"
              className={`role-button ${
                role === "teacher" ? "role-button-active" : ""
              }`}
              onClick={() => handleRoleChange("teacher")}
            >
              Teacher
            </button>

          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label htmlFor="login-identifier">
              {role === "student" ? "Email / Student ID" : "Email / Faculty ID"}
            </label>

            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                role === "student"
                  ? "Enter student ID, roll number or email"
                  : "Enter faculty ID or email"
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>

            <div style={{ position: "relative", display: "flex" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{ width: "100%", paddingRight: "44px" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#7C3AED",
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="login-quick-hint">
            <span>
              Initial demo password (if unchanged):{" "}
              <strong>{DEMO_PASSWORD}</strong>
            </span>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#B91C1C",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: 600,
                marginTop: "4px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Checking..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}


// ==========================================
// APP
// ==========================================

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedRole, setSelectedRole] = useState("student");

  const [activePage, setActivePage] = useState("home");

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState(null);


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = (role) => {
    setSelectedRole(role);
    setIsLoggedIn(true);
    setActivePage("home");
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage("home");
  };


  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigate = (page, assignmentId = null) => {

    if (page === "assignments" && assignmentId) {
      setSelectedAssignmentId(assignmentId);
      setActivePage("assignmentDetails");
      return;
    }

    setActivePage(page);
  };


  // ==========================================
  // USER
  // ==========================================

  const user =
    selectedRole === "student"
      ? studentData
      : teacherData;


  // ==========================================
  // PAGE TITLES
  // ==========================================

  const pageTitles = {
    home: "Home",
    timetable: "Time Table",
    attendance: "Attendance",
    events: "Events",
    achievementHistory: "Achievement History",
    assignmentDetails: "Assignment Details",
    teachingContent: "Teaching Content",
    assignments: "Assignments",

    // Leave / OD
    studentLeaveApproval: "Leave & OD Requests",

    profile: "Profile",
    settings: "Settings",
    billing: "Billing",
    leave: "Leave",
  };


  // ==========================================
  // STUDENT PAGES
  // ==========================================

  const renderStudentPage = (settings = {}) => {

    // HOME
    if (activePage === "home") {
      return (
        <StudentHome
          onNavigate={handleNavigate}
          onOpenAssignment={handleNavigate}
        />
      );
    }


    // TIME TABLE
    if (activePage === "timetable") {
      return <Timetable />;
    }


    // ATTENDANCE
    if (activePage === "attendance") {
      return <Attendance />;
    }


    // EVENTS
    if (activePage === "events") {
      return <StudentEvents />;
    }


    // ACHIEVEMENT HISTORY
    if (activePage === "achievementHistory") {
      return <AchievementHistory />;
    }


    // ASSIGNMENT DETAILS
    if (activePage === "assignmentDetails") {
      return (
        <AssignmentDetails
          assignmentId={selectedAssignmentId}
          onBack={() => handleNavigate("home")}
        />
      );
    }


    // TEACHING CONTENT
    if (activePage === "teachingContent") {
      return <TeachingContent />;
    }


    // PROFILE
    if (activePage === "profile") {
      return <Profile />;
    }


    // SETTINGS
    if (activePage === "settings") {
      return (
        <Settings
          user={studentData}
          onLogout={handleLogout}
          preferences={settings.preferences}
          onPreferencesChange={settings.onPreferencesChange}
          onContactSupport={settings.onRequestHelp}
        />
      );
    }


    // BILLING
    if (activePage === "billing") {
      return <Billing />;
    }


    // LEAVE & OD
    if (activePage === "leave") {
      return <Leave />;
    }


    return <StudentHome />;
  };


  // ==========================================
  // TEACHER PAGES
  // ==========================================

  const renderTeacherPage = (settings = {}) => {

    // HOME
    if (activePage === "home") {
      return <TeacherHome onNavigate={handleNavigate} />;
    }


    // TIME TABLE
    if (activePage === "timetable") {
      return <TeacherTimetable />;
    }


    // TEACHING CONTENT
    if (activePage === "teachingContent") {
      return <TeacherTeachingContent />;
    }


    // ATTENDANCE
    if (activePage === "attendance") {
      return <TeacherAttendance />;
    }


    // ASSIGNMENTS
    if (activePage === "assignments") {
      return <TeacherAssignments />;
    }


    // STUDENT LEAVE & OD APPROVAL
    if (activePage === "studentLeaveApproval") {
      return <LeaveApproval />;
    }


    // TEACHER PROFILE
    if (activePage === "profile") {
      return <TeacherProfile />;
    }


    // TEACHER SETTINGS
    if (activePage === "settings") {
      return (
        <Settings
          user={teacherData}
          role="teacher"
          onLogout={handleLogout}
          preferences={settings.preferences}
          onPreferencesChange={settings.onPreferencesChange}
          onContactSupport={settings.onRequestHelp}
        />
      );
    }


    return <TeacherHome />;
  };


  // ==========================================
  // LOGIN SCREEN
  // ==========================================

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <DashboardLayout
      user={user}
      role={selectedRole}
      activePage={activePage}
      pageTitle={pageTitles[activePage] || "Home"}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >

      {({ preferences, onPreferencesChange, onRequestHelp }) =>
        selectedRole === "student"
          ? renderStudentPage({
              preferences,
              onPreferencesChange,
              onRequestHelp,
            })
          : renderTeacherPage({
              preferences,
              onPreferencesChange,
              onRequestHelp,
            })}

    </DashboardLayout>
  );
}


export default App;