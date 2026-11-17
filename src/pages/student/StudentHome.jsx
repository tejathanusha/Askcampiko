import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  BookOpen,
  ClipboardCheck,
  Trophy,
  CheckCircle2,
} from "lucide-react";

import {
  studentData,
  studentTimetable,
  attendanceData,
  studentAssignments,
  events,
} from "../../data/mockData";
import {
  getStudentAssignments,
  getStudentAttendanceData,
} from "../../data/teacherPortalStore";

import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getTodayName() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function calculateOverallAttendance(attendance) {
  const subjects = Object.values(attendance);

  if (!subjects.length) {
    return 0;
  }

  const conducted = subjects.reduce(
    (total, item) => total + item.conducted,
    0
  );

  const present = subjects.reduce(
    (total, item) => total + item.present,
    0
  );

  if (!conducted) {
    return 0;
  }

  return Math.round((present / conducted) * 100);
}

function StudentHome({ onNavigate }) {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const [studentAssignmentsList, setStudentAssignmentsList] =
    useState(studentAssignments);
  const [studentAttendance, setStudentAttendance] = useState(attendanceData);
  const [portalDataError, setPortalDataError] = useState("");

  useEffect(() => {
    const refreshPortalData = () => {
      try {
        setStudentAssignmentsList(getStudentAssignments());
        setStudentAttendance(
          getStudentAttendanceData(studentData.id, attendanceData)
        );
        setPortalDataError("");
      } catch (error) {
        console.error("Unable to load recently updated student portal data.", error);
        setPortalDataError(
          "Some recently updated class information could not be loaded."
        );
      }
    };

    refreshPortalData();
    window.addEventListener(
      "askCampikoTeacherAssignmentsUpdated",
      refreshPortalData
    );
    window.addEventListener(
      "askCampikoTeacherAttendanceUpdated",
      refreshPortalData
    );
    window.addEventListener("storage", refreshPortalData);
    return () => {
      window.removeEventListener(
        "askCampikoTeacherAssignmentsUpdated",
        refreshPortalData
      );
      window.removeEventListener(
        "askCampikoTeacherAttendanceUpdated",
        refreshPortalData
      );
      window.removeEventListener("storage", refreshPortalData);
    };
  }, []);

  const today = getTodayName();

  const workingDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const selectedDay = workingDays.includes(today)
    ? today
    : "Monday";

  const todaySchedule = studentTimetable[selectedDay] || [];

  const overallAttendance = calculateOverallAttendance(studentAttendance);

  const pendingAssignments = studentAssignmentsList.filter(
    (assignment) =>
      assignment.submissionStatus !== "Submitted"
  );

  const ongoingEvents = events.filter(
    (event) => event.status === "ongoing"
  );

  const handleAssignmentClick = (assignment) => {
    if (onNavigate) {
      onNavigate("assignments", assignment.id);
    }
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="welcome-section">
        <div>
          <span className="welcome-label">
            {t("STUDENT DASHBOARD")}
          </span>

          <h1>
            {t(getGreeting())}, {studentData.name}
          </h1>

          <p>
            {t("Your campus. Your questions.")}
          </p>
        </div>

        <div className="welcome-profile">
          <div className="welcome-profile-avatar">
            {studentData.name?.charAt(0)}
          </div>

          <div>
            <strong>{studentData.name}</strong>

            <span>
              {studentData.branch} • Section{" "}
              {studentData.section}
            </span>
          </div>
        </div>
      </section>

      {portalDataError && (
        <p className="teacher-feedback teacher-feedback-error" role="alert">
          {portalDataError}
        </p>
      )}

      {/* =====================================================
          TODAY'S CLASSES
      ===================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Today's Classes"
          subtitle={`${selectedDay} • ${todaySchedule.length} classes scheduled`}
          actionLabel="View Time Table"
          onAction={() =>
            onNavigate && onNavigate("timetable")
          }
        />

        <div className="timetable-table-wrapper">

          {todaySchedule.length > 0 ? (
            <table className="timetable-table">

              <thead>
                <tr>
                  <th>{t("Period")}</th>
                  <th>{t("Time")}</th>
                  <th>{t("Subject")}</th>
                  <th>{t("Faculty")}</th>
                  <th>{t("Room")}</th>
                  <th>{t("Section")}</th>
                </tr>
              </thead>

              <tbody>

                {todaySchedule.map((item, index) => (
                  <tr key={index}>

                    <td>
                      <span className="period-badge">
                        {item.period || index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="table-info">
                        <Clock3 size={16} />

                        <span>
                          {item.startTime} -{" "}
                          {item.endTime}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="subject-cell">

                        <div className="subject-icon">
                          <CalendarDays size={17} />
                        </div>

                        <strong>
                          {item.subject}
                        </strong>

                      </div>
                    </td>

                    <td>
                      <div className="table-info">
                        <UserRound size={16} />

                        <span>
                          {item.faculty}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="table-info">
                        <MapPin size={16} />

                        <span>
                          {item.room}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="section-badge">
                        {item.section ||
                          studentData.section}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          ) : (
            <div className="empty-state">
              <CalendarDays size={32} />

              <p>
                {t("No classes scheduled for")}{" "}
                {t(selectedDay)}.
              </p>
            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          QUICK SUMMARY
      ===================================================== */}

      <section className="timetable-summary">

        <div className="timetable-summary-card">

          <div className="stat-card-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>{t("Today's Classes")}</span>

            <strong>
              {todaySchedule.length}
            </strong>
          </div>

        </div>


        <div className="timetable-summary-card">

          <div className="stat-card-icon">
            <ClipboardCheck size={21} />
          </div>

          <div>
            <span>{t("Attendance")}</span>

            <strong>
              {overallAttendance}%
            </strong>
          </div>

        </div>


        <div className="timetable-summary-card">

          <div className="stat-card-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <span>{t("Pending Assignments")}</span>

            <strong>
              {pendingAssignments.length}
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================================
          ASSIGNMENTS
      ===================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Assignments"
          subtitle="Assignments that require your attention"
        />

        <div className="timetable-table-wrapper">

          {studentAssignmentsList.length > 0 ? (

            <table className="timetable-table">

              <thead>
                <tr>
                  <th>{t("Subject")}</th>
                  <th>{t("Assignment")}</th>
                  <th>{t("Faculty")}</th>
                  <th>{t("Deadline")}</th>
                  <th>{t("Status")}</th>
                </tr>
              </thead>

              <tbody>

                {studentAssignmentsList.map(
                  (assignment) => (
                    <tr
                      key={assignment.id}
                      onClick={() =>
                        handleAssignmentClick(
                          assignment
                        )
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >

                      <td>
                        <div className="subject-cell">

                          <div className="subject-icon">
                            <BookOpen size={17} />
                          </div>

                          <strong>
                            {assignment.subjectCode}
                          </strong>

                        </div>
                      </td>

                      <td>
                        <strong>
                          {assignment.title}
                        </strong>
                      </td>

                      <td>
                        <div className="table-info">
                          <UserRound size={16} />

                          <span>
                            {assignment.faculty}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="table-info">
                          <Clock3 size={16} />

                          <span>
                            {assignment.deadline}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            assignment.submissionStatus ===
                            "Submitted"
                              ? "section-badge"
                              : "period-badge"
                          }
                        >
                          {
                            t(assignment.submissionStatus)
                          }
                        </span>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          ) : (

            <div className="empty-state">

              <CheckCircle2 size={32} />

              <p>
                {t("No assignments available.")}
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          CAMPUS EVENTS
      ===================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Campus Events"
          subtitle="Current and upcoming campus activities"
        />

        <div className="timetable-table-wrapper">

          <table className="timetable-table">

            <thead>
              <tr>
                <th>{t("Event")}</th>
                <th>{t("Status")}</th>
                <th>{t("Event Date")}</th>
                <th>{t("Location")}</th>
                <th>{t("Application Deadline")}</th>
              </tr>
            </thead>

            <tbody>

              {events.map((event) => (
                <tr key={event.id}>

                  <td>
                    <div className="subject-cell">

                      <div className="subject-icon">
                        <Trophy size={17} />
                      </div>

                      <strong>
                        {event.title}
                      </strong>

                    </div>
                  </td>

                  <td>
                    <span className="section-badge">
                      {t(event.status)}
                    </span>
                  </td>

                  <td>
                    <div className="table-info">
                      <CalendarDays size={16} />

                      <span>
                        {event.eventDate}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="table-info">
                      <MapPin size={16} />

                      <span>
                        {event.location}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="table-info">
                      <Clock3 size={16} />

                      <span>
                        {event.deadline}
                      </span>
                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          CAMPUS STATUS
      ===================================================== */}

      <section className="timetable-summary">

        <div className="timetable-summary-card">

          <div className="stat-card-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>{t("Campus Status")}</span>

            <strong>
              {t("Operating Normally")}
            </strong>
          </div>

        </div>


        <div className="timetable-summary-card">

          <div className="stat-card-icon">
            <Trophy size={21} />
          </div>

          <div>
            <span>{t("Ongoing Events")}</span>

            <strong>
              {ongoingEvents.length}
            </strong>
          </div>

        </div>


        <div className="timetable-summary-card">

          <div className="stat-card-icon">
            <UserRound size={21} />
          </div>

          <div>
            <span>Section</span>

            <strong>
              {t(studentData.section)}
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default StudentHome;