import React from "react";
import {
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  CalendarDays,
  BookOpen,
  MapPin,
  IdCard,
} from "lucide-react";

import { studentData } from "../../data/mockData";
import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function Profile() {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  return (
    <div className="dashboard-page">

      {/* Profile Header */}
      <section className="welcome-section">
        <div className="welcome-content">

          <div className="profile-page-avatar">
            <UserRound size={34} />
          </div>

          <div>
            <p className="welcome-eyebrow">
              {t("STUDENT PROFILE")}
            </p>

            <h1>
              {studentData.name}
            </h1>

            <p>
              {t("View your academic and personal information.")}
            </p>
          </div>

        </div>
      </section>


      {/* Basic Information */}
      <section className="dashboard-section">

        <SectionHeader
          title={t("Basic Information")}
          subtitle={t("Your registered student information")}
        />

        <div className="profile-info-grid">

          <div className="profile-info-card">
            <div className="profile-info-icon">
              <IdCard size={19} />
            </div>

            <div>
              <span>{t("Student ID")}</span>
              <strong>
                {studentData.id || "STU001"}
              </strong>
            </div>
          </div>


          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Mail size={19} />
            </div>

            <div>
              <span>{t("Email")}</span>
              <strong>
                {studentData.email || "student@campiko.edu"}
              </strong>
            </div>
          </div>


          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Phone size={19} />
            </div>

            <div>
              <span>{t("Phone")}</span>
              <strong>
                {studentData.phone || "Not provided"}
              </strong>
            </div>
          </div>


          <div className="profile-info-card">
            <div className="profile-info-icon">
              <Building2 size={19} />
            </div>

            <div>
              <span>{t("Department")}</span>
              <strong>
                {studentData.department || "Computer Science and Engineering"}
              </strong>
            </div>
          </div>

        </div>

      </section>


      {/* Academic Information */}
      <section className="dashboard-section">

        <SectionHeader
          title={t("Academic Information")}
          subtitle={t("Your current academic details")}
        />

        <div className="profile-academic-grid">

          <div className="profile-academic-card">

            <div className="profile-academic-icon">
              <GraduationCap size={21} />
            </div>

            <div>
              <span>{t("Year")}</span>
              <strong>
                {studentData.year || "3rd Year"}
              </strong>
            </div>

          </div>


          <div className="profile-academic-card">

            <div className="profile-academic-icon">
              <BookOpen size={21} />
            </div>

            <div>
              <span>{t("Branch")}</span>
              <strong>
                {studentData.branch || "CSE"}
              </strong>
            </div>

          </div>


          <div className="profile-academic-card">

            <div className="profile-academic-icon">
              <UsersIcon />
            </div>

            <div>
              <span>{t("Section")}</span>
              <strong>
                {studentData.section || "B"}
              </strong>
            </div>

          </div>


          <div className="profile-academic-card">

            <div className="profile-academic-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>{t("Semester")}</span>
              <strong>
                {studentData.semester || "5"}
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* College Information */}
      <section className="dashboard-section">

        <SectionHeader
          title={t("College Information")}
          subtitle={t("Institution details")}
        />

        <div className="profile-college-card">

          <div className="profile-college-icon">
            <Building2 size={24} />
          </div>

          <div className="profile-college-content">

            <h3>
              Aaru Padai Veedu Institute of Technology
            </h3>

            <div className="profile-college-details">

              <span>
                <MapPin size={15} />
                Chennai, Tamil Nadu
              </span>

              <span>
                <GraduationCap size={15} />
                B.Tech
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


/*
 * Small reusable icon for Section
 */
function UsersIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default Profile;