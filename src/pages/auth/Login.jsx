import React, { useState } from "react";
import { GraduationCap, UserCheck, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("STU2026001");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "student") {
      setIdentifier("STU2026001");
    } else {
      setIdentifier("FAC2026001");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role);
  };

  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    if (targetRole === "student") {
      setIdentifier("STU2026001");
      setPassword("studentpass");
    } else {
      setIdentifier("FAC2026001");
      setPassword("teacherpass");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <GraduationCap size={26} strokeWidth={2.4} />
          </div>
          <div className="login-logo-text">
            <h1>Ask Campiko</h1>
            <p>Your campus. Your questions.</p>
          </div>
        </div>

        {/* Role Selection Heading */}
        <div className="login-role-section">
          <h2>Welcome Back</h2>
          <p>Select your role to continue</p>

          <div className="role-selector" role="tablist" aria-label="User role selection">
            <button
              type="button"
              role="tab"
              aria-selected={role === "student"}
              className={`role-button ${role === "student" ? "role-button-active" : ""}`}
              onClick={() => handleRoleChange("student")}
            >
              <GraduationCap size={16} />
              <span>Student</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={role === "teacher"}
              className={`role-button ${role === "teacher" ? "role-button-active" : ""}`}
              onClick={() => handleRoleChange("teacher")}
            >
              <UserCheck size={16} />
              <span>Teacher</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
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
                role === "student" ? "Enter student ID (e.g. STU2026001)" : "Enter faculty ID (e.g. FAC2026001)"
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div style={{ position: "relative", width: "100%" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#6f6680",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Quick Fill Demo Hint */}
          <div className="login-quick-hint">
            <span>
              Demo: <strong>{role === "student" ? "STU2026001" : "FAC2026001"}</strong>
            </span>
            <button
              type="button"
              className="login-quick-btn"
              onClick={() => handleQuickFill(role)}
            >
              Fill Credentials
            </button>
          </div>

          <button type="submit" className="login-button">
            <span>Access Dashboard</span>
            <ArrowRight size={17} />
          </button>
        </form>

        <div className="login-footer-note">
          Ask Campiko Academic Portal • Secure Campus Login
        </div>
      </div>
    </div>
  );
}
