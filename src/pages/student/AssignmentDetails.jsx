import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Upload,
  UserRound,
} from "lucide-react";

import {
  studentData,
  studentAssignments,
} from "../../data/mockData";

import SectionHeader from "../../components/SectionHeader";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";
import {
  getStudentAssignments,
  submitStudentAssignment,
} from "../../data/teacherPortalStore";

function AssignmentDetails({
  assignmentId,
  onBack,
}) {
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const [assignment, setAssignment] = useState(() =>
    studentAssignments.find((item) => item.id === assignmentId) || null
  );
  const [assignmentError, setAssignmentError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const refreshAssignment = () => {
      try {
        const updatedAssignment = getStudentAssignments().find(
          (item) => item.id === assignmentId
        ) || null;
        setAssignment(updatedAssignment);
        setSubmitted(updatedAssignment?.submissionStatus === "Submitted");
        setAssignmentError("");
      } catch (error) {
        console.error("Unable to load the requested assignment.", error);
        setAssignmentError("The assignment could not be loaded from this browser.");
      }
    };

    refreshAssignment();
    window.addEventListener(
      "askCampikoTeacherAssignmentsUpdated",
      refreshAssignment
    );
    window.addEventListener("storage", refreshAssignment);
    return () => {
      window.removeEventListener(
        "askCampikoTeacherAssignmentsUpdated",
        refreshAssignment
      );
      window.removeEventListener("storage", refreshAssignment);
    };
  }, [assignmentId]);

  if (!assignment) {
    return (
      <div className="dashboard-page">

        <section className="welcome-section">
          <div>
            <span className="welcome-label">{t("ASSIGNMENT")}</span>

            <h1>{t("Assignment Not Found")}</h1>

            <p>
              {t("The requested assignment could not be found.")}
            </p>
          </div>

          <div className="welcome-profile">
            <div className="welcome-profile-avatar">
              {studentData.name?.charAt(0)}
            </div>

            <div>
              <strong>{studentData.name}</strong>

              <span>
                {studentData.branch} • Section{" "}
                {studentData.section}
              </span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">

          <button
            className="section-header-action"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            {t("Back to Assignments")}
          </button>

        </section>

      </div>
    );
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile && !submitted) {
      alert("Please select a file before submitting.");
      return;
    }

    try {
      if (assignment.teacherCreated) {
        submitStudentAssignment(
          assignment.id,
          studentData.id,
          selectedFile.name
        );
      }
      setSubmitted(true);
      setAssignmentError("");
    } catch (error) {
      console.error("Unable to save the assignment submission.", error);
      setAssignmentError("Your submission could not be saved. Check browser storage and try again.");
    }
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="welcome-section">

        <div>

          <span className="welcome-label">{t("ASSIGNMENT SUBMISSION")}</span>

          <h1>
            {assignment.title}
          </h1>

          <p>
            {assignment.subject} •{" "}
            {assignment.subjectCode}
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


      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <section className="dashboard-section">

        <button
          className="timetable-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          {t("Back to Assignments")}
        </button>

      </section>


      {/* =====================================================
          ASSIGNMENT OVERVIEW
      ===================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Assignment Overview"
          subtitle="Details provided by your faculty"
        />

        <div className="timetable-table-wrapper">

          <table className="timetable-table">

            <thead>
              <tr>
                <th>{t("Information")}</th>
                <th>{t("Details")}</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <div className="table-info">
                    <FileText size={16} />
                    <span>{t("Subject")}</span>
                  </div>
                </td>

                <td>
                  <strong>
                    {assignment.subject}
                  </strong>
                </td>
              </tr>


              <tr>
                <td>
                  <div className="table-info">
                    <UserRound size={16} />
                    <span>{t("Faculty")}</span>
                  </div>
                </td>

                <td>
                  {assignment.faculty}
                </td>
              </tr>


              <tr>
                <td>
                  <div className="table-info">
                    <CalendarDays size={16} />
                    <span>{t("Assigned Date")}</span>
                  </div>
                </td>

                <td>
                  {assignment.assignedDate}
                </td>
              </tr>


              <tr>
                <td>
                  <div className="table-info">
                    <Clock3 size={16} />
                    <span>{t("Deadline")}</span>
                  </div>
                </td>

                <td>
                  <strong>
                    {assignment.deadline}
                  </strong>

                  {" • "}

                  {assignment.deadlineTime}
                </td>
              </tr>


              <tr>
                <td>
                  <div className="table-info">
                    <FileText size={16} />
                    <span>{t("Total Marks")}</span>
                  </div>
                </td>

                <td>
                  {assignment.totalMarks} Marks
                </td>
              </tr>


              <tr>
                <td>
                  <div className="table-info">
                    <CheckCircle2 size={16} />
                    <span>{t("Status")}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={
                      submitted
                        ? "assignment-status submitted"
                        : "assignment-status pending"
                    }
                  >
                    {submitted
                      ? t("Submitted")
                      : t("Pending")}
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <section className="dashboard-section">

        <SectionHeader
          title="Assignment Description"
          subtitle="Instructions from your faculty"
        />

        <div className="timetable-table-wrapper">

          <div className="assignment-description-content">

            <div className="assignment-description-icon">
              <FileText size={22} />
            </div>

            <div>
              <h3>
                {assignment.title}
              </h3>

              <p>
                {assignment.description}
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUBMISSION
      ===================================================== */}

      {assignmentError && (
        <p className="teacher-feedback teacher-feedback-error" role="alert">
          {assignmentError}
        </p>
      )}

      <section className="dashboard-section">

        <SectionHeader
          title="Submit Assignment"
          subtitle={
            submitted
              ? "Your assignment has been submitted"
              : "Upload your completed assignment"
          }
        />

        <div className="timetable-table-wrapper">

          {submitted ? (

            <div className="submission-success">

              <div className="submission-success-icon">
                <CheckCircle2 size={28} />
              </div>

              <div>

                <h3>{t("Assignment Submitted")}</h3>

                <p>
                  {t("Your assignment has been submitted successfully.")}
                </p>

                <span>
                  {t("File")}:{" "}
                  {selectedFile?.name ||
                    assignment.submittedFile ||
                    t("Submitted file")}
                </span>

              </div>

            </div>

          ) : (

            <div className="assignment-upload-content">

              <div className="assignment-upload-icon">
                <Upload size={25} />
              </div>

              <div className="assignment-upload-text">

                <h3>{t("Upload Your Assignment")}</h3>

                <p>
                  {t("Select your completed file. Supported formats: PDF, DOC, DOCX or ZIP.")}
                </p>

              </div>

              <label className="assignment-file-button">

                <Upload size={16} />

                {t("Choose File")}

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  onChange={handleFileChange}
                />

              </label>

              {selectedFile && (
                <div className="selected-file">

                  <FileText size={17} />

                  <div>

                    <strong>
                      {selectedFile.name}
                    </strong>

                    <span>
                      {t("Ready for submission")}
                    </span>

                  </div>

                </div>
              )}

              <button
                className="primary-button"
                onClick={handleSubmit}
              >
                <Upload size={16} />
                {t("Submit Assignment")}
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          ASSIGNMENT SUMMARY
      ===================================================== */}

      <section className="timetable-summary">

        <div className="timetable-summary-card">

          <FileText size={22} />

          <div>
            <span>{t("Subject")}</span>

            <strong>
              {assignment.subjectCode}
            </strong>
          </div>

        </div>


        <div className="timetable-summary-card">

          <Clock3 size={22} />

          <div>
            <span>{t("Deadline")}</span>

            <strong>
              {assignment.deadline}
            </strong>
          </div>

        </div>


        <div className="timetable-summary-card">

          <MapPin size={22} />

          <div>
            <span>{t("Total Marks")}</span>

            <strong>
              {assignment.totalMarks}
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default AssignmentDetails;