import React, { useState } from "react";
import { CalendarDays, Clock3, MapPin, UserRound } from "lucide-react";

import {
  studentData,
  studentTimetable,
} from "../../data/mockData";

import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function getTodayName() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function Timetable() {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const today = getTodayName();

  const defaultDay = days.includes(today) ? today : "Monday";

  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const selectedSchedule = studentTimetable[selectedDay] || [];

  return (
    <div className="dashboard-page">

      {/* Page Header */}
      <section className="welcome-section">
        <div>
          <span className="welcome-label">{t("ACADEMIC SCHEDULE")}</span>

          <h1>{t("Your Time Table")}</h1>

          <p>
            {t("View your classes, faculty, rooms and schedule for each working day.")}
          </p>
        </div>

        <div className="welcome-profile">
          <div className="welcome-profile-avatar">
            {studentData.name?.charAt(0)}
          </div>

          <div>
            <strong>{studentData.name}</strong>
            <span>
              {studentData.branch} • Section {studentData.section}
            </span>
          </div>
        </div>
      </section>

      {/* Day Selector */}
      <section className="dashboard-section">

        <SectionHeader
          title="Weekly Schedule"
          subtitle="Select a day to view your classes"
        />

        <div className="timetable-day-selector">

          <div className="timetable-selector-title">
            <CalendarDays size={20} />
            <span>{t("Working Days")}</span>
          </div>

          <div className="timetable-days">
            {days.map((day) => (
              <button
                key={day}
                className={`timetable-day-button ${
                  selectedDay === day
                    ? "active"
                    : ""
                } ${
                  day === today
                    ? "today"
                    : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <span>{t(day).substring(0, 3)}</span>
                <small>{t(day)}</small>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Timetable */}
      <section className="dashboard-section">

        <SectionHeader
          title={`${selectedDay} Timetable`}
          subtitle={`${selectedSchedule.length} classes scheduled`}
        />

        <div className="timetable-table-wrapper">

          {selectedSchedule.length > 0 ? (

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

                {selectedSchedule.map((item, index) => (

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
                          {item.startTime} - {item.endTime}
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
                          {item.faculty || "Faculty"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="table-info">
                        <MapPin size={16} />
                        <span>
                          {item.room || item.classroom || "Room"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="section-badge">
                        {item.section || studentData.section}
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
                {t("No classes scheduled for")} {t(selectedDay)}.
              </p>
            </div>

          )}

        </div>

      </section>

      {/* Summary */}
      <section className="timetable-summary">

        <div className="timetable-summary-card">
          <CalendarDays size={22} />

          <div>
            <span>{t("Selected Day")}</span>
            <strong>{t(selectedDay)}</strong>
          </div>
        </div>

        <div className="timetable-summary-card">
          <Clock3 size={22} />

          <div>
            <span>{t("Total Classes")}</span>
            <strong>{selectedSchedule.length}</strong>
          </div>
        </div>

        <div className="timetable-summary-card">
          <UserRound size={22} />

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

export default Timetable;