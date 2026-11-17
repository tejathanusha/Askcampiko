import React from "react";

import {
  Home,
  CalendarDays,
  ClipboardCheck,
  Trophy,
  BookOpen,
  UserRound,
  Settings,
  CreditCard,
  FileText,
  Users,
  ClipboardList,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";
import { useLanguage } from "../contexts/languageContext";
import { translate } from "../utils/localization";


const studentMenu = [
  {
    id: "home",
    label: "Home",
    icon: Home,
  },

  {
    id: "timetable",
    label: "Time Table",
    icon: CalendarDays,
  },

  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },

  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
  },

  {
    id: "achievementHistory",
    label: "Achievement History",
    icon: Trophy,
  },

  {
    id: "teachingContent",
    label: "Teaching Content",
    icon: BookOpen,
  },

  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },

  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
  },

  {
    id: "leave",
    label: "Leave",
    icon: FileText,
  },
];


const teacherMenu = [
  {
    id: "home",
    label: "Home",
    icon: Home,
  },

  {
    id: "timetable",
    label: "Time Table",
    icon: CalendarDays,
  },

  {
    id: "teachingContent",
    label: "Teaching Content",
    icon: BookOpen,
  },

  {
    id: "attendance",
    label: "Attendance",
    icon: ClipboardCheck,
  },

  {
    id: "assignments",
    label: "Assignments",
    icon: ClipboardList,
  },

  {
    id: "studentLeaveApproval",
    label: "Student Leave Approval",
    icon: Users,
  },

  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];


function Sidebar({
  role = "student",
  activePage = "home",
  onNavigate,
  onLogout,
  onNeedHelp,
  isOpen = true,
  onClose,
}) {
  const language = useLanguage();
  const menu =
    role === "teacher"
      ? teacherMenu
      : studentMenu;

  return (
    <aside
      className={`sidebar ${
        isOpen ? "sidebar-open" : ""
      }`}
    >

      {/* BRAND */}
      <div className="sidebar-brand">

        <div className="sidebar-logo">
          <GraduationCap
            size={22}
            strokeWidth={2.2}
          />
        </div>

        <div className="sidebar-brand-text">
          <strong>Ask Campiko</strong>
          <span>Campus Live</span>
        </div>

        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

      </div>


      {/* ROLE */}
      <div className="sidebar-role">

        <div className="sidebar-role-icon">
          <UserRound size={16} />
        </div>

        <div>
          <span>{translate(language, "Logged in as")}</span>

          <strong>
            {role === "teacher"
              ? translate(language, "Teacher")
              : translate(language, "Student")}
          </strong>
        </div>

      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-navigation">

        <div className="sidebar-section-title">
          MENU
        </div>

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.id}
              className={`sidebar-item ${
                activePage === item.id
                  ? "sidebar-item-active"
                  : ""
              }`}
              onClick={() => {
                onNavigate(item.id);

                if (onClose) {
                  onClose();
                }
              }}
            >
              <Icon
                size={18}
                strokeWidth={2}
              />

              <span>{translate(language, item.label)}</span>
            </button>
          );
        })}

      </nav>


      {/* BOTTOM */}
      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-help"
          onClick={onNeedHelp}
        >

          <div className="sidebar-help-icon">
            ?
          </div>

          <div>
            <strong>{translate(language, "Need help?")}</strong>

            <span>
              {translate(language, "Ask Campiko Assistant")}
            </span>
          </div>

        </button>


        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
        >
          <LogOut
            size={18}
            strokeWidth={2}
          />

          <span>{translate(language, "Logout")}</span>
        </button>

      </div>

    </aside>
  );
}


export default Sidebar;