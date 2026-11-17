import React, { useState } from "react";
import { BookOpen, Clock3, MapPin } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import {
  teacherBacklog,
  teacherCourseProgress,
  teacherData,
  teacherTimetable,
} from "../../data/mockData";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getToday() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return days.includes(today) ? today : "Monday";
}

function Timetable() {
  const [selectedDay, setSelectedDay] = useState(getToday);
  const schedule = teacherTimetable[selectedDay] || [];

  return (
    <div className="dashboard-page teacher-page">
      <section className="welcome-section">
        <div>
          <span className="welcome-label">ACADEMIC SCHEDULE</span>
          <h1>My Time Table</h1>
          <p>View your classes by day, section, and subject. Your assigned subjects are highlighted.</p>
        </div>
        <div className="welcome-profile">
          <div className="welcome-profile-avatar">{teacherData.name.charAt(0)}</div>
          <div><strong>{teacherData.name}</strong><span>{teacherData.subjects.join(" · ")}</span></div>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Weekly Schedule" subtitle="Select a working day to see your class periods." />
        <div className="timetable-days">
          {days.map((day) => (
            <button
              type="button"
              key={day}
              className={`timetable-day-button ${selectedDay === day ? "active" : ""} ${getToday() === day ? "today" : ""}`}
              aria-pressed={selectedDay === day}
              onClick={() => setSelectedDay(day)}
            >
              <span>{day.slice(0, 3)}</span><small>{day}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title={`${selectedDay} Classes`} subtitle={`${schedule.length} classes scheduled`} />
        {schedule.length > 0 ? (
          <div className="timetable-table-wrapper">
            <table className="timetable-table teacher-table">
              <thead><tr><th>Period</th><th>Time</th><th>Subject</th><th>Class / Section</th><th>Room</th></tr></thead>
              <tbody>
                {schedule.map((item) => {
                  const isAssignedSubject = teacherData.subjects.includes(item.subject);
                  return (
                    <tr className={isAssignedSubject ? "teacher-own-subject" : ""} key={`${item.period}-${item.section}`}>
                      <td><span className="period-badge">{item.period}</span></td>
                      <td><div className="table-info"><Clock3 size={15} /><span>{item.startTime} – {item.endTime}</span></div></td>
                      <td><div className="subject-cell"><div className="subject-icon"><BookOpen size={16} /></div><strong>{item.subject}</strong>{isAssignedSubject && <span className="teacher-own-subject-badge">My subject</span>}</div></td>
                      <td>{item.section}</td>
                      <td><div className="table-info"><MapPin size={15} /><span>{item.room}</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state">No classes scheduled for {selectedDay}.</div>}
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Teaching Goals" subtitle="Classes conducted so far and the target for each subject." />
        <div className="teacher-progress-grid">
          {teacherData.subjects.map((subject) => {
            const progress = teacherCourseProgress[subject];
            const percentage = Math.min(100, Math.round((progress.completedClasses / progress.targetClasses) * 100));
            return (
              <article className="teacher-progress-card" key={subject}>
                <div><h3>{subject}</h3><span>{progress.completedClasses} of {progress.targetClasses} classes</span></div>
                <progress value={progress.completedClasses} max={progress.targetClasses} aria-label={`${subject} teaching progress`} />
                <small>{progress.targetClasses - progress.completedClasses} classes remaining · {percentage}% complete</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Backlogged Content" subtitle="Topics to reschedule for sections affected by missed classes." />
        <div className="teacher-backlog-grid">
          {teacherBacklog.map((item) => (
            <article className="teacher-backlog-card" key={`${item.subject}-${item.section}-${item.topic}`}>
              <span className="teacher-status-pill">Needs rescheduling</span>
              <h3>{item.topic}</h3>
              <p>{item.subject} · {item.section}</p>
              <small>Original class: {item.scheduledDate} · {item.reason}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Timetable;