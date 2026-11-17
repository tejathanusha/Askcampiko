import React from "react";
import {
  BookOpen,
  Building2,
  IdCard,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import { teacherData } from "../../data/mockData";

function Profile() {
  const details = [
    { label: "Faculty ID", value: teacherData.id, icon: IdCard },
    { label: "Full name", value: teacherData.fullName || teacherData.name, icon: UserRound },
    { label: "Designation", value: teacherData.designation, icon: UserRound },
    { label: "Department", value: teacherData.department, icon: Building2 },
    { label: "Email", value: teacherData.email, icon: Mail },
    { label: "Phone", value: teacherData.phone, icon: Phone },
  ];

  return (
    <div className="dashboard-page teacher-page">
      <section className="welcome-section">
        <div className="welcome-content">
          <div className="profile-page-avatar"><UserRound size={34} /></div>
          <div>
            <p className="welcome-eyebrow">TEACHER PROFILE</p>
            <h1>{teacherData.fullName || teacherData.name}</h1>
            <p>Your faculty and teaching information.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Personal & Faculty Information" subtitle="Your registered faculty details." />
        <div className="profile-info-grid">
          {details.map(({ label, value, icon: Icon }) => (
            <article className="profile-info-card" key={label}>
              <div className="profile-info-icon"><Icon size={19} /></div>
              <div><span>{label}</span><strong>{value || "Not provided"}</strong></div>
            </article>
          ))}
          <article className="profile-info-card">
            <div className="profile-info-icon"><BookOpen size={19} /></div>
            <div><span>Subjects taught</span><strong>{teacherData.subjects.join(", ")}</strong></div>
          </article>
          <article className="profile-info-card">
            <div className="profile-info-icon"><Building2 size={19} /></div>
            <div><span>Classes / sections</span><strong>{teacherData.sections.join(", ")}</strong></div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Profile;