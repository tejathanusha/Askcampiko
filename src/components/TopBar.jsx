import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCheck,
  Menu,
  Search,
} from "lucide-react";
import { getCampusAssistantResponse } from "../utils/campusAssistant";
import { getLeaveRequests } from "../data/leaveRequestStore";
import { useLanguage } from "../contexts/languageContext";
import { translate } from "../utils/localization";

// ============================================================
// ASK CAMPIKO - MOCK NOTIFICATIONS
// ============================================================
// Demo data only. Later these will be created by real actions,
// for example when a teacher approves a student's leave request.
//
// Fields:
//   id            unique id for the notification
//   type          decides the icon: assignment, attendance, timetable,
//                 leave, announcement, submission, reminder
//   title         short heading
//   message       short description
//   createdAt     date and time (local time, shown in the panel)
//   read          true if already read
//   targetPage    page key used in App.jsx to open when clicked
//                 (use null if the notification has no page)
//   assignmentId  only for student assignment notifications


// ============================================================
// STUDENT NOTIFICATIONS
// ============================================================

const studentNotifications = [
  {
    id: "SN001",
    type: "assignment",
    title: "New assignment: Normalization Assignment",
    message:
      "Dr. Priya Sharma posted a new Database Management Systems assignment. Due 02 October 2026, 11:59 PM.",
    createdAt: "2026-09-28T09:15:00",
    read: false,
    targetPage: "assignments",
    assignmentId: "ASSIGN001",
  },

  {
    id: "SN002",
    type: "attendance",
    title: "Low attendance: Java Programming",
    message:
      "Your attendance in Java Programming is 71%. Attend upcoming classes to stay above 75%.",
    createdAt: "2026-09-30T08:45:00",
    read: false,
    targetPage: "attendance",
  },

  {
    id: "SN003",
    type: "timetable",
    title: "Timetable updated",
    message:
      "Your Friday timetable has been revised. Please check the new schedule.",
    createdAt: "2026-09-29T17:20:00",
    read: false,
    targetPage: "timetable",
  },

  {
    id: "SN004",
    type: "leave",
    title: "Leave request approved",
    message:
      "Your medical leave for 15 to 16 September 2026 was approved by Dr. Priya Sharma.",
    createdAt: "2026-09-14T16:05:00",
    read: true,
    targetPage: "leave",
  },

  {
    id: "SN005",
    type: "announcement",
    title: "AI Innovation Hackathon",
    message:
      "Registrations are open until 05 October 2026. The event is on 10 October at the Innovation Lab.",
    createdAt: "2026-09-30T11:00:00",
    read: false,
    targetPage: "events",
  },

  {
    id: "SN006",
    type: "announcement",
    title: "Fee payment reminder",
    message: "A balance of ₹25,000 is due by 10 Oct 2026.",
    createdAt: "2026-10-01T10:00:00",
    read: false,
    targetPage: "billing",
  },
];


// ============================================================
// TEACHER NOTIFICATIONS
// ============================================================

const teacherNotifications = [
  {
    id: "TN001",
    type: "leave",
    title: "New leave request: Rahul Kumar",
    message:
      "Rahul Kumar (23CSE012, CSE-B) requested medical leave for 01 to 02 October 2026.",
    createdAt: "2026-09-30T09:40:00",
    read: false,
    targetPage: "studentLeaveApproval",
  },

  {
    id: "TN002",
    type: "leave",
    title: "New OD request: Sneha Reddy",
    message:
      "Sneha Reddy (23CSE018, CSE-B) requested OD for 05 to 06 October 2026.",
    createdAt: "2026-09-30T14:10:00",
    read: false,
    targetPage: "studentLeaveApproval",
  },

  {
    id: "TN003",
    type: "submission",
    title: "Assignment submissions",
    message:
      "32 of 45 students in CSE-B have submitted the Normalization Assignment.",
    createdAt: "2026-10-01T08:30:00",
    read: false,
    targetPage: "assignments",
  },

  {
    id: "TN004",
    type: "timetable",
    title: "Timetable change",
    message:
      "Your Thursday Period 5 class (Database Management Systems, CSE-B) has been rescheduled. Please check the updated timetable.",
    createdAt: "2026-09-29T16:45:00",
    read: false,
    targetPage: "timetable",
  },

  {
    id: "TN005",
    type: "reminder",
    title: "Class reminder: CSE-A at 09:00 AM",
    message: "Database Management Systems, Period 1, Room CSE-204.",
    createdAt: "2026-10-02T08:30:00",
    read: false,
    targetPage: "timetable",
  },

  {
    id: "TN006",
    type: "announcement",
    title: "Code Sprint 2026",
    message:
      "Student applications close on 15 October 2026. Faculty are requested to encourage participation.",
    createdAt: "2026-09-28T12:00:00",
    read: true,
    targetPage: null,
  },
];

function TopBar({
  user,
  role = "student",
  pageTitle,
  onMenuClick,
  onNavigate,
  preferences,
}) {
  const language = useLanguage();
  const [leaveRequests, setLeaveRequests] = useState(() => getLeaveRequests());
  useEffect(() => {
    const refreshLeaveRequests = () => {
      setLeaveRequests(getLeaveRequests());
    };

    window.addEventListener("askCampikoLeaveUpdated", refreshLeaveRequests);
    window.addEventListener("storage", refreshLeaveRequests);
    return () => {
      window.removeEventListener(
        "askCampikoLeaveUpdated",
        refreshLeaveRequests
      );
      window.removeEventListener("storage", refreshLeaveRequests);
    };
  }, []);

  const leaveNotifications =
    role === "teacher"
      ? leaveRequests.flatMap((request) => {
          const notifications = [];
          const notificationDate =
            request.updatedAt || request.createdAt || request.appliedDate;
          const parsedDate = new Date(notificationDate);
          const createdAt = Number.isNaN(parsedDate.getTime())
            ? new Date(0).toISOString()
            : parsedDate.toISOString();

          if (request.status === "Pending") {
            notifications.push({
              id: `leave-request-${request.id}`,
              type: "leave",
              title: `New ${request.requestType} request: ${request.studentName}`,
              message: `${request.studentName} (${request.studentId}, ${request.section}) requested ${request.requestType.toLowerCase()} for ${request.fromDate} to ${request.toDate}.`,
              createdAt: request.createdAt || createdAt,
              targetPage: "studentLeaveApproval",
            });
          }

          if (request.status === "Pending" && Array.isArray(request.reminders)) {
            notifications.push(
              ...request.reminders.map((reminder) => ({
                id: `leave-reminder-${request.id}-${reminder.id}`,
                type: "reminder",
                title: `Reminder from ${request.studentName}`,
                message: `${request.studentName} followed up on a pending ${request.requestType.toLowerCase()} request: ${reminder.message}`,
                createdAt: reminder.sentAt || createdAt,
                targetPage: "studentLeaveApproval",
              }))
            );
          }

          return notifications;
        })
      : leaveRequests
          .filter(
            (request) =>
              request.studentId === user?.id &&
              ["Approved", "Rejected"].includes(request.status)
          )
          .map((request) => ({
            id: `leave-status-${request.id}-${request.status}`,
            type: "leave",
            title: `${request.requestType} request ${request.status.toLowerCase()}`,
            message:
              request.status === "Approved"
                ? `Your request for ${request.fromDate} to ${request.toDate} was approved.`
                : `Your request for ${request.fromDate} to ${request.toDate} was rejected.`,
            createdAt:
              request.updatedAt ||
              request.approvedDate ||
              request.appliedDate,
            targetPage: "leave",
          }));

  const notifications = [
    ...(role === "teacher" ? teacherNotifications : studentNotifications),
    ...leaveNotifications,
  ];
  const [readIds, setReadIds] = useState(
    () =>
      new Set(
        [...studentNotifications, ...teacherNotifications]
          .filter((notification) => notification.read)
          .map((notification) => notification.id)
      )
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantResult, setAssistantResult] = useState(null);
  const assistantInputRef = useRef(null);
  const unreadCount = notifications.filter(
    (notification) => !readIds.has(notification.id)
  ).length;
  const campusNotificationsEnabled =
    preferences?.campusNotifications !== false;

  useEffect(() => {
    const handleOpenAssistant = (event) => {
      const prompt = event.detail?.prompt || "";
      if (prompt) {
        setAssistantQuestion(prompt);
        setAssistantResult(null);
      }
      assistantInputRef.current?.focus();
      assistantInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    window.addEventListener("askCampikoOpenAssistant", handleOpenAssistant);
    return () => {
      window.removeEventListener(
        "askCampikoOpenAssistant",
        handleOpenAssistant
      );
    };
  }, []);

  const markRead = (notification) => {
    setReadIds((current) => new Set(current).add(notification.id));
    setIsNotificationsOpen(false);

    if (notification.targetPage) {
      onNavigate(notification.targetPage, notification.assignmentId);
    }
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((notification) => notification.id)));
  };

  const handleAssistantSubmit = (event) => {
    event.preventDefault();
    const result = getCampusAssistantResponse(assistantQuestion, role);
    setAssistantResult(result);

    if (result.targetPage) {
      onNavigate(result.targetPage, result.assignmentId);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label={translate(language, "Open navigation menu")}
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title">
          <strong>{translate(language, pageTitle)}</strong>
          <span>Ask Campiko Campus Live</span>
        </div>
      </div>

      <div className="assistant-search-container">
        <form className="ask-search" onSubmit={handleAssistantSubmit}>
          <Search className="ask-search-icon" size={17} />
          <input
            ref={assistantInputRef}
            aria-label={translate(language, "Ask Campiko")}
            type="search"
            value={assistantQuestion}
            onChange={(event) => {
              setAssistantQuestion(event.target.value);
              setAssistantResult(null);
            }}
            placeholder={translate(language, "Ask Campiko about your campus...")}
          />
          <button
            type="submit"
            aria-label={translate(language, "Ask Campiko")}
          >
            <ArrowRight size={17} />
          </button>
        </form>

        {assistantResult && (
          <section
            className="assistant-answer-panel"
            aria-label="Ask Campiko answer"
            aria-live="polite"
          >
            <strong>{translate(language, "Ask Campiko")}</strong>
            <p>{assistantResult.answer}</p>
            {assistantResult.targetPage && (
              <button
                type="button"
                onClick={() =>
                  onNavigate(
                    assistantResult.targetPage,
                    assistantResult.assignmentId
                  )
                }
              >
                {translate(
                  language,
                  `Open ${
                    assistantResult.targetPage === "studentLeaveApproval"
                      ? "Leave & OD Requests"
                      : assistantResult.targetPage === "achievementHistory"
                        ? "Achievement History"
                        : assistantResult.targetPage
                  }`
                )}
                <ArrowRight size={15} />
              </button>
            )}
          </section>
        )}
      </div>

      <div className="topbar-right">
        <div className="notification-menu">
          <button
            type="button"
            className="notification-button"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            aria-label={
              campusNotificationsEnabled
                ? `${translate(language, "Notifications")}${
                    unreadCount
                      ? `, ${unreadCount} ${translate(language, "unread")}`
                      : ""
                  }`
                : translate(language, "Notifications are off")
            }
            aria-expanded={isNotificationsOpen}
            aria-controls="notification-panel"
          >
            <Bell size={19} />
            {campusNotificationsEnabled && unreadCount > 0 && (
              <span className="notification-dot" aria-hidden="true" />
            )}
          </button>

          {isNotificationsOpen && (
            <section
              className="notification-panel"
              id="notification-panel"
              aria-label={translate(language, "Notifications")}
            >
              <div className="notification-panel-header">
                <div>
                  <strong>{translate(language, "Notifications")}</strong>
                  <span>
                    {campusNotificationsEnabled
                      ? `${unreadCount} ${translate(language, "unread")}`
                      : translate(language, "Campus notifications are off")}
                  </span>
                </div>
                <button
                  type="button"
                  className="notification-mark-all"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck size={15} />
                  {translate(language, "Mark all read")}
                </button>
              </div>

              <div className="notification-list">
                {notifications.map((notification) => {
                  const isRead = readIds.has(notification.id);

                  return (
                    <button
                      type="button"
                      key={notification.id}
                      className={`notification-item${isRead ? " notification-item-read" : ""}`}
                      onClick={() => markRead(notification)}
                    >
                      <span className="notification-item-heading">
                        <strong>{notification.title}</strong>
                        {!isRead && <span className="notification-unread-dot" />}
                      </span>
                      <span className="notification-item-message">
                        {notification.message}
                      </span>
                      <time dateTime={notification.createdAt}>
                        {new Date(notification.createdAt).toLocaleString(
                          undefined,
                          { dateStyle: "medium", timeStyle: "short" }
                        )}
                      </time>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="topbar-user">
          <div className="topbar-avatar" aria-hidden="true">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="topbar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>
              {translate(language, role === "teacher" ? "Teacher" : "Student")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
