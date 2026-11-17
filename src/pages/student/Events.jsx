import React from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Timer,
  CalendarClock,
} from "lucide-react";

import { studentData, events } from "../../data/mockData";

import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function Events() {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const ongoingEvents = events.filter(
    (event) => event.status === "ongoing"
  );

  const upcomingEvents = events.filter(
    (event) => event.status === "upcoming"
  );

  const completedEvents = events.filter(
    (event) => event.status === "completed"
  );

  const getStatusLabel = (status) => {
    if (status === "ongoing") return "Ongoing";
    if (status === "upcoming") return "Upcoming";
    if (status === "completed") return "Completed";

    return status;
  };

  const getStatusClass = (status) => {
    if (status === "ongoing") return "event-status-ongoing";
    if (status === "upcoming") return "event-status-upcoming";
    return "event-status-completed";
  };

  const renderEventCard = (event) => (
    <div className="event-card" key={event.id || event.title}>
      <div className="event-card-top">
        <div className="event-card-icon">
          <CalendarDays size={20} />
        </div>

        <span
          className={`event-status ${getStatusClass(
            event.status
          )}`}
        >
          {t(getStatusLabel(event.status))}
        </span>
      </div>

      <h3>{event.title}</h3>

      <p className="event-description">
        {event.description}
      </p>

      <div className="event-details">

        <div className="event-detail">
          <CalendarClock size={15} />
          <span>
            {t("Event Date")}:{" "}
            {event.eventDate || event.date || "TBA"}
          </span>
        </div>

        {event.location && (
          <div className="event-detail">
            <MapPin size={15} />
            <span>{event.location}</span>
          </div>
        )}

        {event.deadline && (
          <div className="event-detail">
            <Clock3 size={15} />
            <span>
              {t("Application Deadline")}: {event.deadline}
            </span>
          </div>
        )}

      </div>

      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noreferrer"
          className="event-apply-button"
        >
          {t("View Application")}
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  );

  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}

      <section className="welcome-section">

        <div>
          <span className="welcome-label">
            {t("CAMPUS ACTIVITIES")}
          </span>

          <h1>{t("Events")}</h1>

          <p>
            {t("Discover hackathons, technical events, workshops and activities happening on campus.")}
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

      {/* EVENT OVERVIEW */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-card-top">
            <div className="stat-card-icon">
              <Timer size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Ongoing Events")}</p>
            <h3>{ongoingEvents.length}</h3>
            <span>{t("Happening now")}</span>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">
            <div className="stat-card-icon">
              <CalendarClock size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Upcoming Events")}</p>
            <h3>{upcomingEvents.length}</h3>
            <span>{t("Coming soon")}</span>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">
            <div className="stat-card-icon">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Completed Events")}</p>
            <h3>{completedEvents.length}</h3>
            <span>{t("Past activities")}</span>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-card-top">
            <div className="stat-card-icon">
              <CalendarDays size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Total Events")}</p>
            <h3>{events.length}</h3>
            <span>{t("Campus activities")}</span>
          </div>

        </div>

      </section>

      {/* ONGOING */}

      {ongoingEvents.length > 0 && (
        <section className="dashboard-section">

          <SectionHeader
            title={t("Ongoing Events")}
            subtitle={t("Events happening right now")}
          />

          <div className="events-grid">
            {ongoingEvents.map(renderEventCard)}
          </div>

        </section>
      )}

      {/* UPCOMING */}

      {upcomingEvents.length > 0 && (
        <section className="dashboard-section">

          <SectionHeader
            title={t("Upcoming Events")}
            subtitle={t("Plan ahead and register before deadlines")}
          />

          <div className="events-grid">
            {upcomingEvents.map(renderEventCard)}
          </div>

        </section>
      )}

      {/* COMPLETED */}

      {completedEvents.length > 0 && (
        <section className="dashboard-section">

          <SectionHeader
            title={t("Completed Events")}
            subtitle={t("Previously conducted campus activities")}
          />

          <div className="events-grid">
            {completedEvents.map(renderEventCard)}
          </div>

        </section>
      )}

    </div>
  );
}

export default Events;