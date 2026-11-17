import React from "react";
import { BookOpen, CalendarDays } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import {
  teacherBacklog,
  teacherData,
  teacherTeachingPlan,
  teacherTimetable,
} from "../../data/mockData";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getToday() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return days.includes(today) ? today : "Monday";
}

function TeachingContent() {
  const today = getToday();
  const lessons = days.flatMap((day) =>
    (teacherTimetable[day] || []).map((classItem) => ({
      ...classItem,
      day,
      topic: teacherTeachingPlan[day]?.find(
        (lesson) =>
          lesson.subject === classItem.subject &&
          lesson.section === classItem.section
      )?.topic || "Topic to be planned",
    }))
  );

  return (
    <div className="dashboard-page teacher-page">
      <section className="welcome-section">
        <div>
          <span className="welcome-label">WEEKLY LESSON PLAN</span>
          <h1>Teaching Content</h1>
          <p>Planned topics for each working day, subject, and section.</p>
        </div>
        <div className="welcome-profile">
          <div className="welcome-profile-avatar">{teacherData.name.charAt(0)}</div>
          <div><strong>{teacherData.name}</strong><span>{teacherData.subjects.join(" · ")}</span></div>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="This Week's Teaching Plan" subtitle="Each scheduled class has a corresponding lesson topic." />
        <div className="timetable-table-wrapper">
          <table className="timetable-table teacher-table">
            <thead><tr><th>Working Day</th><th>Time</th><th>Subject</th><th>Class / Section</th><th>Topic to Teach</th></tr></thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr className={lesson.day === today ? "teacher-today-row" : ""} key={`${lesson.day}-${lesson.period}-${lesson.section}`}>
                  <td><span className="teacher-day-label"><CalendarDays size={15} />{lesson.day}{lesson.day === today ? " · Today" : ""}</span></td>
                  <td>{lesson.startTime} – {lesson.endTime}</td>
                  <td>{lesson.subject}</td>
                  <td>{lesson.section}</td>
                  <td><span className="teacher-topic-label"><BookOpen size={15} />{lesson.topic}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Backlogged Content" subtitle="Topics from missed classes that still need to be covered." />
        <div className="teacher-backlog-grid">
          {teacherBacklog.map((item) => (
            <article className="teacher-backlog-card" key={`${item.subject}-${item.section}-${item.topic}`}>
              <span className="teacher-status-pill">Reschedule</span>
              <h3>{item.topic}</h3>
              <p>{item.subject} · {item.section}</p>
              <small>Missed on {item.scheduledDate} · {item.reason}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TeachingContent;