import React from "react";
import { BookOpen, CalendarDays, Clock3, MapPin } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import {
  teacherBacklog,
  teacherData,
  teacherTeachingPlan,
  teacherTimetable,
} from "../../data/mockData";

const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function getToday() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function TeacherHome({ onNavigate }) {
  const actualDay = getToday();
  const today = workingDays.includes(actualDay) ? actualDay : "Monday";
  const schedule = teacherTimetable[today] || [];
  const dayPlan = teacherTeachingPlan[today] || [];

  return (
    <div className="dashboard-page teacher-page">
      <section className="welcome-section">
        <div>
          <span className="welcome-label">TEACHER DASHBOARD</span>
          <h1>Welcome, {teacherData.name}</h1>
          <p>Your classes and teaching plan for {actualDay}.</p>
        </div>
        <div className="welcome-profile">
          <div className="welcome-profile-avatar">{teacherData.name.charAt(0)}</div>
          <div>
            <strong>{teacherData.name}</strong>
            <span>{teacherData.designation} · {teacherData.branch}</span>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader
          title={actualDay === today ? "Today's Classes" : `Next Working Day · ${today}`}
          subtitle={`${schedule.length} classes scheduled`}
          actionLabel="View Time Table"
          onAction={() => onNavigate?.("timetable")}
        />
        {schedule.length > 0 ? (
          <div className="teacher-class-list">
            {schedule.map((classItem) => {
              const lesson = dayPlan.find(
                (item) =>
                  item.subject === classItem.subject &&
                  item.section === classItem.section
              );
              return (
                <article className="teacher-class-card" key={`${classItem.section}-${classItem.period}`}>
                  <div className="teacher-class-period">Period {classItem.period}</div>
                  <div className="teacher-class-main">
                    <h2>{classItem.subject}</h2>
                    <div className="teacher-class-meta">
                      <span><Clock3 size={15} />{classItem.startTime} – {classItem.endTime}</span>
                      <span><CalendarDays size={15} />{classItem.section}</span>
                      <span><MapPin size={15} />{classItem.room}</span>
                    </div>
                    {lesson && <p><BookOpen size={15} /> Planned topic: <strong>{lesson.topic}</strong></p>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No classes are scheduled for {today}.</div>
        )}
      </section>

      <section className="dashboard-section">
        <SectionHeader
          title="Classes to Make Up"
          subtitle="Content from classes not conducted; arrange these topics with the relevant sections."
          actionLabel="View Teaching Content"
          onAction={() => onNavigate?.("teachingContent")}
        />
        <div className="teacher-backlog-grid">
          {teacherBacklog.map((item) => (
            <article className="teacher-backlog-card" key={`${item.subject}-${item.section}-${item.topic}`}>
              <span className="teacher-status-pill">Backlog</span>
              <h3>{item.topic}</h3>
              <p>{item.subject} · {item.section}</p>
              <small>{item.scheduledDate} · {item.reason}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TeacherHome;
