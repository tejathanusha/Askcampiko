import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  CalendarDays,
} from "lucide-react";

import { teachingContent, studentData } from "../../data/mockData";
import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function TeachingContent() {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const subjects = Object.keys(teachingContent);

  const [selectedSubject, setSelectedSubject] = useState(
    subjects[0]
  );

  const selectedContent = teachingContent[selectedSubject];

  return (
    <div className="dashboard-page">

      {/* Header */}
      <section className="welcome-section">
        <div className="welcome-content">
          <p className="welcome-label">
            {t("Academic Learning")}
          </p>

          <h1>{t("Teaching Content")}</h1>

          <p>
            {t("View topics covered in your classes and the topics planned for upcoming classes.")}
          </p>
        </div>

        <div className="profile-summary">
          <div className="profile-avatar">
            {studentData.name?.charAt(0) || "S"}
          </div>

          <div className="profile-summary-info">
            <strong>{studentData.name}</strong>

            <span>
              {studentData.branch} • Section{" "}
              {studentData.section}
            </span>
          </div>
        </div>
      </section>

      {/* Subject Selection */}
      <section className="dashboard-section">

        <SectionHeader
          title={t("Subjects")}
          subtitle={t("Select a subject to view teaching content")}
        />

        <div className="teaching-subject-list">

          {subjects.map((subject) => (
            <button
              type="button"
              key={subject}
              className={`teaching-subject-item ${
                selectedSubject === subject
                  ? "teaching-subject-item-active"
                  : ""
              }`}
              onClick={() =>
                setSelectedSubject(subject)
              }
            >
              <BookOpen size={18} />

              <span>{subject}</span>
            </button>
          ))}

        </div>

      </section>

      {/* Selected Subject */}
      <section className="dashboard-section">

        <SectionHeader
          title={selectedSubject}
          subtitle={t("Current teaching progress")}
        />

        {/* Summary */}
        <div className="teaching-info-grid">

          <div className="teaching-info-card">
            <div className="teaching-info-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>{t("Topics Covered")}</span>
              <strong>
                {selectedContent.covered.length}
              </strong>
            </div>
          </div>

          <div className="teaching-info-card">
            <div className="teaching-info-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>{t("Upcoming Topics")}</span>
              <strong>
                {selectedContent.upcoming.length}
              </strong>
            </div>
          </div>

          <div className="teaching-info-card">
            <div className="teaching-info-icon">
              <BookOpen size={20} />
            </div>

            <div>
              <span>{t("Current Topic")}</span>
              <strong>
                {selectedContent.current}
              </strong>
            </div>
          </div>

        </div>

        {/* Topics Covered */}
        <div className="teaching-topic-section">

          <div className="teaching-topic-header">
            <div>
              <h2>{t("Topics Covered")}</h2>

              <p>
                {t("Topics already completed in class")}
              </p>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <div className="teaching-topic-list">

            {selectedContent.covered.map(
              (topic, index) => (
                <div
                  className="teaching-topic-row"
                  key={topic}
                >
                  <div className="teaching-topic-number">
                    {index + 1}
                  </div>

                  <div className="teaching-topic-content">
                    <strong>{topic}</strong>
                  </div>

                  <span className="teaching-topic-status completed">
                    {t("Completed")}
                  </span>
                </div>
              )
            )}

          </div>

        </div>

        {/* Current Topic */}
        <div className="teaching-topic-section">

          <div className="teaching-topic-header">
            <div>
              <h2>{t("Current Topic")}</h2>

              <p>
                {t("Topic currently being covered in class")}
              </p>
            </div>

            <BookOpen size={20} />
          </div>

          <div className="teaching-topic-list">

            <div className="teaching-topic-row">

              <div className="teaching-topic-number upcoming">
                <CalendarDays size={16} />
              </div>

              <div className="teaching-topic-content">
                <strong>
                  {selectedContent.current}
                </strong>
              </div>

              <span className="teaching-topic-status upcoming">
                {t("In Progress")}
              </span>

            </div>

          </div>

        </div>

        {/* Upcoming Topics */}
        <div className="teaching-topic-section">

          <div className="teaching-topic-header">
            <div>
              <h2>{t("Upcoming Topics")}</h2>

              <p>
                {t("Topics planned for upcoming classes")}
              </p>
            </div>

            <Clock3 size={20} />
          </div>

          <div className="teaching-topic-list">

            {selectedContent.upcoming.map(
              (topic, index) => (
                <div
                  className="teaching-topic-row"
                  key={topic}
                >
                  <div className="teaching-topic-number upcoming">
                    {index + 1}
                  </div>

                  <div className="teaching-topic-content">
                    <strong>{topic}</strong>
                  </div>

                  <span className="teaching-topic-status upcoming">
                    {t("Upcoming")}
                  </span>
                </div>
              )
            )}

          </div>

        </div>

      </section>

    </div>
  );
}

export default TeachingContent;