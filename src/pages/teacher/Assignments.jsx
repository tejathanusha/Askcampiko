import React, { useEffect, useState } from "react";
import { CalendarDays, ClipboardList, Plus, Users } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";
import { teacherClassRosters, teacherData } from "../../data/mockData";
import { createTeacherAssignment, getTeacherAssignments } from "../../data/teacherPortalStore";

function Assignments() {
  const [initialAssignments] = useState(() => {
    try {
      return { assignments: getTeacherAssignments(), error: "" };
    } catch (error) {
      console.error("Unable to load teacher assignments.", error);
      return {
        assignments: [],
        error: "Assignments could not be loaded from this browser. Check browser storage and try again.",
      };
    }
  });
  const [assignments, setAssignments] = useState(initialAssignments.assignments);
  const [errorMessage, setErrorMessage] = useState(initialAssignments.error);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(teacherData.subjects[0]);
  const [section, setSection] = useState(teacherData.sections[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState("20");
  const [successMessage, setSuccessMessage] = useState("");

  const refreshAssignments = () => {
    try {
      setAssignments(getTeacherAssignments());
      setErrorMessage("");
    } catch (error) {
      console.error("Unable to load teacher assignments.", error);
      setErrorMessage("Assignments could not be loaded from this browser. Check browser storage and try again.");
    }
  };

  useEffect(() => {
    window.addEventListener("askCampikoTeacherAssignmentsUpdated", refreshAssignments);
    window.addEventListener("storage", refreshAssignments);
    return () => {
      window.removeEventListener("askCampikoTeacherAssignmentsUpdated", refreshAssignments);
      window.removeEventListener("storage", refreshAssignments);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (endDate < startDate) {
      setErrorMessage("The end date must be on or after the assignment start date.");
      return;
    }

    try {
      createTeacherAssignment({
        title: title.trim(),
        subject,
        section,
        startDate,
        endDate,
        description: description.trim(),
        totalMarks: Number(totalMarks),
        faculty: teacherData.name,
      });
      setTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setTotalMarks("20");
      setAssignments(getTeacherAssignments());
      setSuccessMessage(`Assignment published for ${section}.`);
    } catch (error) {
      console.error("Unable to publish the teacher assignment.", error);
      setErrorMessage("The assignment could not be saved. Check browser storage and try again.");
    }
  };

  return (
    <div className="dashboard-page teacher-page">
      <section className="welcome-section">
        <div>
          <span className="welcome-label">CLASS WORK</span>
          <h1>Assignments</h1>
          <p>Create assignments for a class and follow submissions through the due date.</p>
        </div>
        <div className="welcome-profile">
          <div className="welcome-profile-avatar">{teacherData.name.charAt(0)}</div>
          <div><strong>{teacherData.name}</strong><span>{teacherData.subjects.join(" · ")}</span></div>
        </div>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Create an Assignment" subtitle="Set the subject, class, start date, and due date." />
        <form className="teacher-assignment-form" onSubmit={handleSubmit}>
          <label className="teacher-assignment-title">
            Assignment title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Database normalization" required maxLength={100} />
          </label>
          <label>
            Subject
            <select value={subject} onChange={(event) => setSubject(event.target.value)}>
              {teacherData.subjects.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Class / section
            <select value={section} onChange={(event) => setSection(event.target.value)}>
              {teacherData.sections.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Starting date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
          </label>
          <label>
            Due date
            <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} required />
          </label>
          <label>
            Total marks
            <input type="number" min="1" max="1000" value={totalMarks} onChange={(event) => setTotalMarks(event.target.value)} required />
          </label>
          <label className="teacher-assignment-description">
            Instructions
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the work students should complete." rows={3} required maxLength={1000} />
          </label>
          {errorMessage && <p className="teacher-feedback teacher-feedback-error" role="alert">{errorMessage}</p>}
          {successMessage && <p className="teacher-feedback teacher-feedback-success" role="status">{successMessage}</p>}
          <div className="teacher-assignment-submit">
            <span><Users size={16} /> {teacherClassRosters[section]?.length || 0} students in {section}</span>
            <button type="submit" className="primary-button"><Plus size={16} /> Publish assignment</button>
          </div>
        </form>
      </section>

      <section className="dashboard-section">
        <SectionHeader title="Assignments & Submissions" subtitle="Submitted and outstanding work for each assignment." />
        {errorMessage && assignments.length === 0 ? null : assignments.length ? (
          <div className="teacher-assignment-list">
            {assignments.map((assignment) => {
              const total = assignment.totalStudents ?? teacherClassRosters[assignment.section]?.length ?? 0;
              const submitted = assignment.submissions?.length ?? assignment.submitted ?? 0;
              const pending = Math.max(0, total - submitted);
              const from = assignment.startDate || assignment.assignedDate || "Previously assigned";
              const to = assignment.endDate || assignment.deadline || "No due date";
              return (
                <article className="teacher-assignment-card" key={assignment.id}>
                  <div className="teacher-assignment-card-header">
                    <div className="teacher-assignment-icon"><ClipboardList size={20} /></div>
                    <div><span className="teacher-assignment-subject">{assignment.subject} · {assignment.section}</span><h2>{assignment.title}</h2></div>
                    <span className={`teacher-status-pill ${pending === 0 ? "complete" : ""}`}>{pending === 0 ? "All submitted" : "In progress"}</span>
                  </div>
                  {assignment.description && <p className="teacher-assignment-card-description">{assignment.description}</p>}
                  <div className="teacher-assignment-card-meta">
                    <span><CalendarDays size={15} /> Starts {from}</span>
                    <span><CalendarDays size={15} /> Due {to}</span>
                    <span><Users size={15} /> {total} students</span>
                  </div>
                  <div className="teacher-submission-counts">
                    <span className="submitted-count">{submitted} submitted</span>
                    <span className="pending-count">{pending} yet to submit</span>
                  </div>
                  <progress value={total ? submitted : 0} max={total || 1} aria-label={`${assignment.title} submissions`} />
                </article>
              );
            })}
          </div>
        ) : <div className="empty-state">No assignments have been published yet.</div>}
      </section>
    </div>
  );
}

export default Assignments;