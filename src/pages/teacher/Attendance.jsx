import React, { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Save } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import {
  studentData,
  teacherClassRosters,
  teacherData,
  teacherTimetable,
} from "../../data/mockData";
import {
  getTeacherAttendanceSessions,
  saveTeacherAttendanceSession,
} from "../../data/teacherPortalStore";

const EMPTY_ROSTER = [];

function getInitialClassSelection() {
  const date = new Date();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  if (!teacherTimetable[weekday]?.length) {
    const daysUntilMonday = (8 - date.getDay()) % 7 || 7;
    date.setDate(date.getDate() + daysUntilMonday);
  }
  const day = date.toLocaleDateString("en-US", { weekday: "long" });
  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    schedule: teacherTimetable[day] || [],
  };
}

function Attendance() {
  const initialSelection = getInitialClassSelection();
  const firstClass = initialSelection.schedule[0];
  const [date, setDate] = useState(initialSelection.date);
  const [section, setSection] = useState(firstClass.section);
  const [subject, setSubject] = useState(firstClass.subject);
  const [period, setPeriod] = useState(firstClass.period);
  const [initialAttendance] = useState(() => {
    try {
      return { sessions: getTeacherAttendanceSessions(), error: "" };
    } catch (error) {
      console.error("Unable to load the selected class register.", error);
      return {
        sessions: [],
        error: "Attendance could not be loaded from this browser. Check browser storage and try again.",
      };
    }
  });
  const [marks, setMarks] = useState(() => {
    const savedSession = initialAttendance.sessions.find(
      (item) =>
        item.date === initialSelection.date &&
        item.section === firstClass.section &&
        item.subject === firstClass.subject &&
        String(item.period) === String(firstClass.period)
    );
    return Object.fromEntries(
      (teacherClassRosters[firstClass.section] || EMPTY_ROSTER).map((student) => [
        student.id,
        savedSession?.studentStatuses?.[student.id] || "Present",
      ])
    );
  });
  const [sessions, setSessions] = useState(initialAttendance.sessions);
  const [errorMessage, setErrorMessage] = useState(initialAttendance.error);
  const [successMessage, setSuccessMessage] = useState("");
  const roster = teacherClassRosters[section] || EMPTY_ROSTER;

  const day = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "";
  const daySchedule = teacherTimetable[day] || [];
  const sectionsForDate = [...new Set(daySchedule.map((item) => item.section))];
  const subjectsForSection = [
    ...new Set(
      daySchedule
        .filter((item) => item.section === section)
        .map((item) => item.subject)
    ),
  ];
  const availableClasses = daySchedule.filter(
    (item) => item.section === section && item.subject === subject
  );

  const selectedSession = sessions.find(
    (item) =>
      item.date === date &&
      item.section === section &&
      item.subject === subject &&
      String(item.period) === String(period)
  );

  const getMarksForSelection = (selection, availableSessions = sessions) => {
    const savedSession = availableSessions.find(
      (item) =>
        item.date === selection.date &&
        item.section === selection.section &&
        item.subject === selection.subject &&
        String(item.period) === String(selection.period)
    );
    return Object.fromEntries(
      (teacherClassRosters[selection.section] || EMPTY_ROSTER).map((student) => [
        student.id,
        savedSession?.studentStatuses?.[student.id] || "Present",
      ])
    );
  };

  const updateSelection = (updates) => {
    const selection = { date, section, subject, period, ...updates };
    const selectedDay = selection.date
      ? new Date(`${selection.date}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "long",
        })
      : "";
    const scheduledClasses = teacherTimetable[selectedDay] || [];

    if (updates.date !== undefined) {
      const matchingClass = scheduledClasses.find(
        (item) =>
          item.section === selection.section &&
          item.subject === selection.subject
      ) || scheduledClasses[0];
      selection.section = matchingClass?.section || "";
      selection.subject = matchingClass?.subject || "";
      selection.period = matchingClass?.period || "";
    } else if (updates.section !== undefined || updates.subject !== undefined) {
      const classesForSelection = scheduledClasses.filter(
        (item) =>
          item.section === selection.section &&
          item.subject === selection.subject
      );
      if (!classesForSelection.length && updates.section !== undefined) {
        const firstClassInSection = scheduledClasses.find(
          (item) => item.section === selection.section
        );
        selection.subject = firstClassInSection?.subject || "";
        selection.period = firstClassInSection?.period || "";
      } else if (
        !classesForSelection.some(
          (item) => String(item.period) === String(selection.period)
        )
      ) {
        selection.period = classesForSelection[0]?.period || "";
      }
    }
    setDate(selection.date);
    setSection(selection.section);
    setSubject(selection.subject);
    setPeriod(selection.period);
    setMarks(getMarksForSelection(selection));
    setSuccessMessage("");
  };

  useEffect(() => {
    const refreshAttendance = () => {
      try {
        const savedSessions = getTeacherAttendanceSessions();
        setSessions(savedSessions);
        setErrorMessage("");
        setMarks(getMarksForSelection({ date, section, subject, period }, savedSessions));
      } catch (error) {
        console.error("Unable to refresh the selected class register.", error);
        setErrorMessage("Attendance could not be loaded from this browser. Check browser storage and try again.");
      }
    };

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
  }, [date, period, section, subject]);

  const getStudentPercentage = (student) => {
    const baseline = student.attendance?.[subject] || { conducted: 0, present: 0 };
    const previousSessions = sessions.filter(
      (item) =>
        item.section === section &&
        item.subject === subject &&
        item.studentStatuses?.[student.id]
    );
    const conducted = baseline.conducted + previousSessions.length;
    const present =
      baseline.present +
      previousSessions.filter(
        (item) => item.studentStatuses[student.id] === "Present"
      ).length;
    return conducted ? Math.round((present / conducted) * 100) : 0;
  };

  const setAllMarks = (status) => {
    setMarks(Object.fromEntries(roster.map((student) => [student.id, status])));
    setSuccessMessage("");
  };

  const handleSave = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      saveTeacherAttendanceSession({
        date,
        section,
        subject,
        period: Number(period),
        markedBy: teacherData.id,
        studentStatuses: marks,
      });
      setSessions(getTeacherAttendanceSessions());
      setSuccessMessage("Attendance saved. The student attendance page is now updated.");
    } catch (error) {
      console.error("Unable to save the selected class register.", error);
      setErrorMessage("Attendance could not be saved. Check browser storage and try again.");
    }
  };

  return (
    <div className="dashboard-page teacher-page">
      <section className="welcome-section">
        <div>
          <span className="welcome-label">CLASS MANAGEMENT</span>
          <h1>Student Attendance</h1>
          <p>Choose the class you taught, mark each student, and save the register.</p>
        </div>
        <div className="welcome-profile">
          <div className="welcome-profile-avatar">{teacherData.name.charAt(0)}</div>
          <div><strong>{teacherData.name}</strong><span>Attendance by class and subject</span></div>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Class Register" subtitle="Attendance percentages include the selected subject's recorded classes." />
        <form className="teacher-attendance-form" onSubmit={handleSave}>
          <div className="teacher-attendance-filters">
            <label>
              Date taught
              <input type="date" value={date} required onChange={(event) => updateSelection({ date: event.target.value })} />
            </label>
            <label>
              Class / section
              <select value={section} onChange={(event) => updateSelection({ section: event.target.value })}>
                {sectionsForDate.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Subject
              <select value={subject} onChange={(event) => updateSelection({ subject: event.target.value })}>
                {subjectsForSection.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Period
              <select value={period} onChange={(event) => updateSelection({ period: event.target.value })}>
                {[...new Set(availableClasses.map((item) => item.period))].sort((a, b) => a - b).map((item) => (
                  <option key={item} value={item}>Period {item}</option>
                ))}
              </select>
            </label>
          </div>

          {errorMessage && <p className="teacher-feedback teacher-feedback-error" role="alert">{errorMessage}</p>}
          {successMessage && <p className="teacher-feedback teacher-feedback-success" role="status">{successMessage}</p>}

          <div className="teacher-roster-heading">
            <div>
              <h2>{section} · {subject}</h2>
              <p>{selectedSession ? "Saved register — update the marks if needed." : "Mark each student present or absent."}</p>
            </div>
            <div className="teacher-roster-bulk-actions">
              <button type="button" className="secondary-button" onClick={() => setAllMarks("Present")}>Mark all present</button>
              <button type="button" className="secondary-button" onClick={() => setAllMarks("Absent")}>Mark all absent</button>
            </div>
          </div>

          <div className="timetable-table-wrapper">
            <table className="timetable-table teacher-table">
              <thead><tr><th>Student</th><th>Roll number</th><th>Attendance to date</th><th>Today's status</th></tr></thead>
              <tbody>
                {roster.map((student) => (
                  <tr key={student.id}>
                    <td><strong>{student.name}</strong>{student.id === studentData.id && <span className="teacher-own-subject-badge">Student demo</span>}</td>
                    <td>{student.rollNumber}</td>
                    <td><span className={`teacher-attendance-percentage ${getStudentPercentage(student) < 75 ? "low" : ""}`}>{getStudentPercentage(student)}%</span></td>
                    <td>
                      <div className="teacher-attendance-options">
                        {["Present", "Absent"].map((status) => (
                          <label key={status} className={marks[student.id] === status ? `selected ${status.toLowerCase()}` : ""}>
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              value={status}
                              checked={marks[student.id] === status}
                              onChange={() => {
                                setMarks((current) => ({ ...current, [student.id]: status }));
                                setSuccessMessage("");
                              }}
                            />
                            {status}
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="teacher-attendance-submit">
            <span><CalendarDays size={16} /> {roster.length} students in this class</span>
            <button type="submit" className="primary-button" disabled={!availableClasses.length}><Save size={16} /> Save attendance</button>
          </div>
        </form>
      </section>

      <section className="dashboard-section">
        <div className="teacher-student-attendance-note">
          <CheckCircle2 size={20} />
          <p>Saved attendance for {studentData.fullName} in {studentData.section} is reflected immediately on the student's Attendance page.</p>
        </div>
      </section>
    </div>
  );
}

export default Attendance;