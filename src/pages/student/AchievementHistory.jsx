import React from "react";
import {
  Trophy,
  CalendarDays,
  Award,
  Users,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import {
  studentData,
  achievements,
} from "../../data/mockData";

import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function AchievementHistory() {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const completedAchievements = achievements || [];

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <section className="welcome-section">
        <div>
          <span className="welcome-label">{t("STUDENT ACHIEVEMENTS")}</span>

          <h1>{t("Achievement History")}</h1>

          <p>
            {t("View your participation, achievements and recognition from hackathons, competitions and campus activities.")}
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

      {/* Summary */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <Trophy size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Total Achievements")}</p>
            <h3>{completedAchievements.length}</h3>
            <span>{t("Recorded activities")}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <Award size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Recognitions")}</p>
            <h3>
              {
                completedAchievements.filter(
                  (item) =>
                    item.result === "Winner" ||
                    item.result === "Runner-up" ||
                    item.result === "Certificate"
                ).length
              }
            </h3>
            <span>{t("Certificates and awards")}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <Users size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Team Events")}</p>
            <h3>
              {
                completedAchievements.filter(
                  (item) => item.type === "Team"
                ).length
              }
            </h3>
            <span>{t("Team participation")}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-card-icon">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="stat-card-content">
            <p>{t("Participation")}</p>
            <h3>{completedAchievements.length}</h3>
            <span>{t("Events participated")}</span>
          </div>
        </div>
      </section>

      {/* Achievement List */}
      <section className="dashboard-section">
        <SectionHeader
          title={t("My Achievements")}
          subtitle={t("Your participation and recognition history")}
        />

        <div className="achievement-list">
          {completedAchievements.length > 0 ? (
            completedAchievements.map((achievement) => (
              <div
                className="achievement-card"
                key={achievement.id || achievement.title}
              >
                <div className="achievement-icon">
                  <Trophy size={22} />
                </div>

                <div className="achievement-content">
                  <div className="achievement-title-row">
                    <div>
                      <h3>{achievement.title}</h3>

                      <p className="achievement-organizer">
                        {t(achievement.organizer ||
                          achievement.event ||
                          "Campus Activity")}
                      </p>
                    </div>

                    {achievement.result && (
                      <span className="achievement-result">
                        {t(achievement.result)}
                      </span>
                    )}
                  </div>

                  {achievement.description && (
                    <p className="achievement-description">
                      {achievement.description}
                    </p>
                  )}

                  <div className="achievement-details">
                    {achievement.date && (
                      <div className="achievement-detail">
                        <CalendarDays size={15} />
                        <span>{achievement.date}</span>
                      </div>
                    )}

                    {achievement.type && (
                      <div className="achievement-detail">
                        <Users size={15} />
                        <span>{achievement.type}</span>
                      </div>
                    )}

                    {achievement.category && (
                      <div className="achievement-detail">
                        <Award size={15} />
                        <span>{achievement.category}</span>
                      </div>
                    )}
                  </div>

                  {achievement.link && (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noreferrer"
                      className="achievement-link"
                    >
                      {t("View Details")}
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Trophy size={32} />

              <p>
                {t("No achievements have been recorded yet.")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AchievementHistory;