import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

import {
  studentData,
  attendanceData,
} from "../../data/mockData";
import { getStudentAttendanceData } from "../../data/teacherPortalStore";

import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function calculatePercentage(present, conducted) {
  if (!conducted) return 0;

  return Math.round((present / conducted) * 100);
}

function classesNeededFor75(present, conducted) {
  const currentPercentage = present / conducted;

  if (currentPercentage >= 0.75) {
    return 0;
  }

  let additionalClasses = 0;

  while (
    (present + additionalClasses) /
      (conducted + additionalClasses) <
    0.75
  ) {
    additionalClasses++;
  }

  return additionalClasses;
}

function Attendance() {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const [studentAttendance, setStudentAttendance] = useState(attendanceData);
  const [attendanceError, setAttendanceError] = useState("");

  useEffect(() => {
    const refreshAttendance = () => {
      try {
        setStudentAttendance(
          getStudentAttendanceData(studentData.id, attendanceData)
        );
        setAttendanceError("");
      } catch (error) {
        console.error("Unable to load attendance marked by a teacher.", error);
        setAttendanceError(
          "Newly marked attendance could not be loaded from this browser."
        );
      }
    };

    refreshAttendance();
    window.addEventListener(
      "askCampikoTeacherAttendanceUpdated",
      refreshAttendance
    );
    window.addEventListener("storage", refreshAttendance);
    return () => {
      window.removeEventListener(
        "askCampikoTeacherAttendanceUpdated",
        refreshAttendance
      );
      window.removeEventListener("storage", refreshAttendance);
    };
  }, []);

  const attendanceSubjects = Object.entries(studentAttendance);

  const totalConducted = attendanceSubjects.reduce(
    (total, [, subject]) =>
      total + subject.conducted,
    0
  );

  const totalPresent = attendanceSubjects.reduce(
    (total, [, subject]) =>
      total + subject.present,
    0
  );

  const totalAbsent = attendanceSubjects.reduce(
    (total, [, subject]) =>
      total + subject.absent,
    0
  );

  const overallPercentage = calculatePercentage(
    totalPresent,
    totalConducted
  );

  const lowAttendanceSubjects =
    attendanceSubjects.filter(
      ([, subject]) =>
        calculatePercentage(
          subject.present,
          subject.conducted
        ) < 75
    );

  return (
    <div className="dashboard-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="welcome-section">

        <div>
          <span className="welcome-label">
            {t("ACADEMIC RECORD")}
          </span>

          <h1>{t("Attendance")}</h1>

          <p>
            {t("Track your attendance across all subjects and stay informed about your attendance requirements.")}
          </p>
        </div>

        <div className="welcome-profile">

          <div className="welcome-profile-avatar">
            {studentData.name?.charAt(0)}
          </div>

          <div>
            <strong>
              {studentData.name}
            </strong>

            <span>
              {studentData.branch} • Section{" "}
              {studentData.section}
            </span>
          </div>

        </div>

      </section>

      {attendanceError && (
        <p className="teacher-feedback teacher-feedback-error" role="alert">
          {attendanceError}
        </p>
      )}

      {/* =================================================
          ATTENDANCE OVERVIEW
      ================================================= */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-card-icon">
              <ClipboardCheck size={20} />
            </div>

          </div>

          <div className="stat-card-content">

            <p>{t("Overall Attendance")}</p>

            <h3>{overallPercentage}%</h3>

            <span>
              {t("Across all subjects")}
            </span>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-card-icon">
              <TrendingUp size={20} />
            </div>

          </div>

          <div className="stat-card-content">

            <p>{t("Classes Conducted")}</p>

            <h3>{totalConducted}</h3>

            <span>
              {t("Total classes")}
            </span>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-card-icon">
              <CheckCircle2 size={20} />
            </div>

          </div>

          <div className="stat-card-content">

            <p>{t("Classes Present")}</p>

            <h3>{totalPresent}</h3>

            <span>
              {t("Classes attended")}
            </span>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">

            <div className="stat-card-icon">
              <AlertCircle size={20} />
            </div>

          </div>

          <div className="stat-card-content">

            <p>{t("Classes Absent")}</p>

            <h3>{totalAbsent}</h3>

            <span>
              {lowAttendanceSubjects.length}{" "}
              subject
              {lowAttendanceSubjects.length !== 1
                ? "s"
                : ""}{" "}
              below 75%
            </span>

          </div>

        </div>

      </section>

      {/* =================================================
          SUBJECT TABLE
      ================================================= */}

      <section className="dashboard-section">

        <SectionHeader
          title="Subject-wise Attendance"
          subtitle="Your attendance record for each subject"
        />

        <div className="timetable-table-wrapper">

          <table className="timetable-table">

            <thead>

              <tr>
                <th>{t("Subject")}</th>
                <th>{t("Conducted")}</th>
                <th>{t("Present")}</th>
                <th>{t("Absent")}</th>
                <th>{t("Attendance")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>

            </thead>

            <tbody>

              {attendanceSubjects.map(
                ([subjectName, subject]) => {

                  const percentage =
                    calculatePercentage(
                      subject.present,
                      subject.conducted
                    );

                  const isLow =
                    percentage < 75;

                  const classesNeeded =
                    classesNeededFor75(
                      subject.present,
                      subject.conducted
                    );

                  return (
                    <tr key={subjectName}>

                      {/* Subject */}

                      <td>

                        <div className="subject-cell">

                          <div className="subject-icon">
                            <ClipboardCheck
                              size={16}
                            />
                          </div>

                          <strong>
                            {subjectName}
                          </strong>

                        </div>

                      </td>

                      {/* Conducted */}

                      <td>
                        {subject.conducted}
                      </td>

                      {/* Present */}

                      <td>
                        {subject.present}
                      </td>

                      {/* Absent */}

                      <td>
                        {subject.absent}
                      </td>

                      {/* Percentage */}

                      <td>

                        <strong
                          style={{
                            color: isLow
                              ? "#b35b42"
                              : "#30243e",
                          }}
                        >
                          {percentage}%
                        </strong>

                      </td>

                      {/* Status */}

                      <td>

                        <div className="table-info">

                          {isLow ? (
                            <AlertCircle
                              size={15}
                            />
                          ) : (
                            <CheckCircle2
                              size={15}
                            />
                          )}

                          <span>
                            {isLow
                              ? "Needs Attention"
                              : "Good"}
                          </span>

                        </div>

                      </td>

                      {/* Action */}

                      <td>

                        {isLow ? (
                          <span>
                            Attend next{" "}
                            {classesNeeded}{" "}
                            class
                            {classesNeeded !== 1
                              ? "es"
                              : ""}
                          </span>
                        ) : (
                          <span>
                            On track
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =================================================
          ATTENDANCE INFORMATION
      ================================================= */}

      <section className="dashboard-section">

        <SectionHeader
          title="Attendance Information"
          subtitle="Keep track of your attendance requirements"
        />

        <div className="timetable-summary">

          <div className="timetable-summary-card">

            <CheckCircle2 size={21} />

            <div>
              <span>
                Attendance Requirement
              </span>

              <strong>
                Minimum 75%
              </strong>
            </div>

          </div>

          <div className="timetable-summary-card">

            <TrendingUp size={21} />

            <div>
              <span>
                Current Attendance
              </span>

              <strong>
                {overallPercentage}%
              </strong>
            </div>

          </div>

          <div className="timetable-summary-card">

            <AlertCircle size={21} />

            <div>
              <span>
                Subjects Needing Attention
              </span>

              <strong>
                {lowAttendanceSubjects.length}
              </strong>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          LOW ATTENDANCE NOTICE
      ================================================= */}

      {lowAttendanceSubjects.length > 0 && (

        <section className="dashboard-section">

          <div
            style={{
              padding: "18px",
              background: "#fffaf8",
              border: "1px solid #f0dfd8",
              borderRadius: "14px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >

            <AlertCircle
              size={20}
              style={{
                color: "#b35b42",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />

            <div>

              <strong
                style={{
                  color: "#6f4032",
                  fontSize: "13px",
                }}
              >
                Attendance needs attention
              </strong>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  fontSize: "11px",
                  lineHeight: 1.6,
                  color: "#8a675d",
                }}
              >
                You currently have{" "}
                {lowAttendanceSubjects.length}{" "}
                subject
                {lowAttendanceSubjects.length !==
                1
                  ? "s"
                  : ""}{" "}
                below the 75% attendance
                requirement. Attend future
                classes regularly to improve
                your percentage.
              </p>

            </div>

          </div>

        </section>

      )}

    </div>
  );
}

export default Attendance;