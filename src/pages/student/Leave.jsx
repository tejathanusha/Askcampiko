import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Upload,
  FileText,
  CalendarDays,
  Clock3,
  X,
} from "lucide-react";

import { studentData } from "../../data/mockData";
import {
  getLeaveRequests,
  addLeaveRequest,
  addLeaveReminder,
  updateLeaveRequest,
} from "../../data/leaveRequestStore";
import { useLanguage } from "../../contexts/languageContext";
import { translate } from "../../utils/localization";

function formatDateForStorage(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getCurrentDateLabel() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function createRequestId() {
  return `REQ${Date.now()}`;
}

const Leave = () => {
  const studentId = studentData.id;
  const studentName = studentData.fullName || studentData.name;
  const studentSection = `${studentData.branch} ${studentData.section}`;
  const language = useLanguage();
  const t = (value) => translate(language, value);
  const [requests, setRequests] = useState(() =>
    getLeaveRequests().filter(
      (request) => request.studentId === studentId
    )
  );

  const [applicationType, setApplicationType] = useState("Leave");
  const [leaveType, setLeaveType] = useState("Casual Leave");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [reason, setReason] = useState("");

  const [odPurpose, setOdPurpose] = useState("");
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");

  const [document, setDocument] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reminderDrafts, setReminderDrafts] = useState({});
  const [reminderFeedback, setReminderFeedback] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleUpdate = () => {
      const allRequests = getLeaveRequests();
      setRequests(
        allRequests.filter(
          (request) => request.studentId === studentId
        )
      );
    };

    window.addEventListener(
      "askCampikoLeaveUpdated",
      handleUpdate
    );

    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(
        "askCampikoLeaveUpdated",
        handleUpdate
      );

      window.removeEventListener("storage", handleUpdate);
    };
  }, [studentId]);

  /* ---------------------------------------------------------
     CALCULATE DURATION
     --------------------------------------------------------- */

  const totalDays = useMemo(() => {
    if (!fromDate || !toDate) {
      return 0;
    }

    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }

    const difference = end.getTime() - start.getTime();

    if (difference < 0) {
      return 0;
    }

    return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
  }, [fromDate, toDate]);

  /* ---------------------------------------------------------
     RESET FORM
     --------------------------------------------------------- */

  const resetForm = () => {
    setFromDate("");
    setToDate("");
    setReason("");
    setOdPurpose("");
    setEventName("");
    setVenue("");
    setDocument(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------------------------------------------------
     APPLICATION TYPE
     --------------------------------------------------------- */

  const handleApplicationTypeChange = (type) => {
    setApplicationType(type);
    setErrorMessage("");
    setSuccessMessage("");

    if (type === "Leave") {
      setOdPurpose("");
      setEventName("");
      setVenue("");
    } else {
      setLeaveType("Casual Leave");
    }

    resetForm();
  };

  /* ---------------------------------------------------------
     FILE UPLOAD
     --------------------------------------------------------- */

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setDocument(selectedFile);
    setErrorMessage("");
  };

  const removeDocument = () => {
    setDocument(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------------------------------------------------
     SUBMIT APPLICATION
     --------------------------------------------------------- */

  const handleSubmit = (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    /* Basic date validation */

    if (!fromDate || !toDate) {
      setErrorMessage(
        "Please select both From Date and To Date."
      );
      return;
    }

    if (totalDays <= 0) {
      setErrorMessage(
        "To Date must be the same as or later than From Date."
      );
      return;
    }

    /* Reason validation */

    if (!reason.trim()) {
      setErrorMessage(
        "Please enter the reason for your application."
      );
      return;
    }

    /* Medical proof validation */

    if (
      applicationType === "Leave" &&
      leaveType === "Medical Leave" &&
      !document
    ) {
      setErrorMessage(
        "Medical proof is required for Medical Leave. Please upload a medical certificate or doctor's prescription."
      );
      return;
    }

    /* OD validation */

    if (applicationType === "OD") {
      if (!odPurpose.trim()) {
        setErrorMessage(
          "Please enter the purpose of the OD."
        );
        return;
      }

      if (!eventName.trim()) {
        setErrorMessage(
          "Please enter the event name."
        );
        return;
      }

      if (!venue.trim()) {
        setErrorMessage(
          "Please enter the venue."
        );
        return;
      }
    }

    /* Create request */

    const newRequest = {
      id: createRequestId(),
      requestType: applicationType,

      studentName,
      studentId,
      section: studentSection,

      leaveType:
        applicationType === "Leave"
          ? leaveType
          : "",

      odPurpose:
        applicationType === "OD"
          ? odPurpose.trim()
          : "",

      eventName:
        applicationType === "OD"
          ? eventName.trim()
          : "",

      venue:
        applicationType === "OD"
          ? venue.trim()
          : "",

      fromDate: formatDateForStorage(fromDate),
      toDate: formatDateForStorage(toDate),

      days: totalDays,

      reason: reason.trim(),

      documentName: document
        ? document.name
        : "",

      status: "Pending",

      appliedDate: getCurrentDateLabel(),
    };

    try {
      const updatedRequests = addLeaveRequest(newRequest);
      setRequests(
        updatedRequests.filter(
          (request) => request.studentId === studentId
        )
      );
      setSuccessMessage(
        `${
          applicationType === "Leave"
            ? "Leave"
            : "OD"
        } application submitted successfully.`
      );
      resetForm();
    } catch (error) {
      console.error("Unable to submit the leave request.", error);
      setErrorMessage(
        "Your application could not be saved. Please try again."
      );
    }
  };

  /* ---------------------------------------------------------
     CANCEL REQUEST
     --------------------------------------------------------- */

  const handleCancelRequest = (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this pending application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedRequests = updateLeaveRequest(requestId, {
        status: "Cancelled",
        cancelledDate: getCurrentDateLabel(),
      });
      setRequests(
        updatedRequests.filter(
          (request) => request.studentId === studentId
        )
      );
    } catch (error) {
      console.error("Unable to cancel the leave request.", error);
      setReminderFeedback((feedback) => ({
        ...feedback,
        [requestId]: {
          type: "error",
          message: "The request could not be cancelled. Please try again.",
        },
      }));
    }
  };

  const handleSendReminder = (request) => {
    const message =
      reminderDrafts[request.id]?.trim() ||
      "Please review my pending request when you have a moment.";

    try {
      const result = addLeaveReminder(
        request.id,
        studentId,
        message
      );
      if (!result) {
        setReminderFeedback((feedback) => ({
          ...feedback,
          [request.id]: {
            type: "error",
            message: "This request is no longer pending.",
          },
        }));
        return;
      }

      setRequests(
        result.requests.filter(
          (item) => item.studentId === studentId
        )
      );
      setReminderDrafts((drafts) => ({
        ...drafts,
        [request.id]: "",
      }));
      setReminderFeedback((feedback) => ({
        ...feedback,
        [request.id]: {
          type: "success",
          message: "Your in-app reminder was sent to the teacher.",
        },
      }));
    } catch (error) {
      console.error("Unable to send the leave reminder.", error);
      setReminderFeedback((feedback) => ({
        ...feedback,
        [request.id]: {
          type: "error",
          message: "The reminder could not be sent. Please try again.",
        },
      }));
    }
  };

  /* ---------------------------------------------------------
     SORT REQUESTS
     --------------------------------------------------------- */

  const sortedRequests = [...requests].sort(
    (a, b) => {
      const aDate = new Date(a.appliedDate);
      const bDate = new Date(b.appliedDate);

      return bDate - aDate;
    }
  );

  return (
    <div className="leave-page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="page-header">
        <div>
          <h1>{t("Leave & OD")}</h1>

          <p>
            {t("Apply for leave or on-duty permission and track your requests.")}
          </p>
        </div>
      </div>

      {/* =====================================================
          APPLICATION TYPE CARDS
          ===================================================== */}

      <div className="leave-request-type-grid">

        {/* LEAVE */}

        <button
          type="button"
          className={`leave-request-type-card ${
            applicationType === "Leave"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleApplicationTypeChange("Leave")
          }
        >
          <div className="leave-request-type-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <h3>{t("Apply for Leave")}</h3>

            <p>
              {t("Request leave for personal, medical or other reasons.")}
            </p>
          </div>
        </button>

        {/* OD */}

        <button
          type="button"
          className={`leave-request-type-card ${
            applicationType === "OD"
              ? "active"
              : ""
          }`}
          onClick={() =>
            handleApplicationTypeChange("OD")
          }
        >
          <div className="leave-request-type-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <h3>{t("Apply for OD")}</h3>

            <p>
              {t("Request permission for official college activities.")}
            </p>
          </div>
        </button>

      </div>

      {/* =====================================================
          APPLICATION FORM
          ===================================================== */}

      <div className="leave-application-card">

        <div className="leave-application-header">
          <div>
            <h2>
              {applicationType === "Leave"
                ? t("Leave Application")
                : t("OD Application")}
            </h2>

            <p>
              {t("Fill in the details below to submit your request.")}
            </p>
          </div>

          <div className="leave-application-badge">
            {t(applicationType)}
          </div>
        </div>

        <form
          className="leave-application-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              LEAVE TYPE
              ================================================= */}

          {applicationType === "Leave" && (
            <div className="leave-form-group">

              <label htmlFor="leave-type">
                {t("Leave Type")}
              </label>

              <select
                id="leave-type"
                value={leaveType}
                onChange={(e) =>
                  setLeaveType(e.target.value)
                }
              >
                <option value="Medical Leave">
                  {t("Medical Leave")}
                </option>

                <option value="Casual Leave">
                  {t("Casual Leave")}
                </option>
              </select>

            </div>
          )}

          {/* =================================================
              OD DETAILS
              ================================================= */}

          {applicationType === "OD" && (
            <div className="leave-form-grid">

              <div className="leave-form-group">
                <label htmlFor="od-purpose">
                  {t("OD Purpose")}
                </label>

                <input
                  id="od-purpose"
                  type="text"
                  placeholder={t("Example: Hackathon")}
                  value={odPurpose}
                  onChange={(e) =>
                    setOdPurpose(e.target.value)
                  }
                />
              </div>

              <div className="leave-form-group">
                <label htmlFor="event-name">
                  {t("Event Name")}
                </label>

                <input
                  id="event-name"
                  type="text"
                  placeholder={t("Enter event name")}
                  value={eventName}
                  onChange={(e) =>
                    setEventName(e.target.value)
                  }
                />
              </div>

              <div className="leave-form-group">
                <label htmlFor="venue">
                  {t("Venue")}
                </label>

                <input
                  id="venue"
                  type="text"
                  placeholder={t("Enter venue")}
                  value={venue}
                  onChange={(e) =>
                    setVenue(e.target.value)
                  }
                />
              </div>

            </div>
          )}

          {/* =================================================
              DATE SECTION
              ================================================= */}

          <div className="leave-date-fields">

            {/* FROM DATE */}

            <div className="leave-form-group">

              <label htmlFor="from-date">
                {t("From Date")}
              </label>

              <input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setErrorMessage("");
                }}
              />

            </div>

            {/* TO DATE */}

            <div className="leave-form-group">

              <label htmlFor="to-date">
                {t("To Date")}
              </label>

              <input
                id="to-date"
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setErrorMessage("");
                }}
              />

            </div>

            {/* DURATION */}

            <div className="leave-form-group">

              <label>
                {t("Duration")}
              </label>

              <div className="leave-duration-box">

                <CalendarDays size={16} />

                <span>
                  {totalDays > 0
                    ? `${totalDays} ${
                        totalDays === 1
                          ? t("day")
                          : t("days")
                      }`
                    : t("Select dates")}
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              REASON
              ================================================= */}

          <div className="leave-form-group">

            <label htmlFor="leave-reason">
              {t("Reason")}
            </label>

            <textarea
              id="leave-reason"
              rows="4"
              placeholder={
                applicationType === "OD"
                  ? t("Explain why you need OD permission...")
                  : t("Enter the reason for your leave...")
              }
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setErrorMessage("");
              }}
            />

          </div>

          {/* =================================================
              MEDICAL DOCUMENT
              ================================================= */}

          {applicationType === "Leave" &&
            leaveType === "Medical Leave" && (
              <div className="leave-proof-section">

                <div className="leave-proof-header">

                  <div>
                    <h3>
                      {t("Medical Proof")}
                      <span className="required-mark">
                        *
                      </span>
                    </h3>

                    <p className="leave-proof-description">
                      {t("Upload a medical certificate or doctor's prescription.")}
                    </p>
                  </div>

                </div>

                {!document ? (
                  <div className="leave-upload-box">

                    <div className="leave-upload-icon">
                      <Upload size={22} />
                    </div>

                    <div className="leave-upload-content">

                      <strong>
                        {t("Upload medical proof")}
                      </strong>

                      <span>
                        PDF, JPG or PNG
                      </span>

                    </div>

                    <button
                      type="button"
                      className="leave-upload-button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      {t("Choose File")}
                    </button>

                    <input
                      ref={fileInputRef}
                      id="leave-proof-file"
                      type="file"
                      className="leave-hidden-file-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />

                  </div>
                ) : (
                  <div className="leave-upload-box">

                    <div className="leave-upload-icon">
                      <FileText size={22} />
                    </div>

                    <div className="leave-upload-content">

                      <strong>
                        {document.name}
                      </strong>

                      <span>
                        {t("Document selected")}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="leave-upload-button"
                      onClick={removeDocument}
                    >
                      {t("Change File")}
                    </button>

                    <button
                      type="button"
                      className="leave-form-close-button"
                      onClick={removeDocument}
                      aria-label={t("Remove document")}
                    >
                      <X size={18} />
                    </button>

                  </div>
                )}

                <div className="leave-proof-required">
                  {t("Medical proof is required for Medical Leave.")}
                </div>

              </div>
            )}

          {/* =================================================
              OD SUPPORTING DOCUMENT
              ================================================= */}

          {applicationType === "OD" && (
            <div className="leave-proof-section">

              <div className="leave-proof-header">

                <div>
                  <h3>
                    {t("Supporting Document")}
                    <span className="optional-mark">
                      {" "}
                      ({t("Optional")})
                    </span>
                  </h3>

                  <p className="leave-proof-description">
                    {t("Upload an invitation, event letter or other supporting document.")}
                  </p>
                </div>

              </div>

              {!document ? (
                <div className="leave-upload-box">

                  <div className="leave-upload-icon">
                    <Upload size={22} />
                  </div>

                  <div className="leave-upload-content">

                    <strong>
                      {t("Upload supporting document")}
                    </strong>

                    <span>
                      PDF, JPG or PNG
                    </span>

                  </div>

                  <button
                    type="button"
                    className="leave-upload-button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    {t("Choose File")}
                  </button>

                  <input
                    ref={fileInputRef}
                    id="leave-proof-file"
                    type="file"
                    className="leave-hidden-file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />

                </div>
              ) : (
                <div className="leave-upload-box">

                  <div className="leave-upload-icon">
                    <FileText size={22} />
                  </div>

                  <div className="leave-upload-content">

                    <strong>
                      {document.name}
                    </strong>

                    <span>
                      {t("Document selected")}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="leave-upload-button"
                    onClick={removeDocument}
                  >
                    {t("Change File")}
                  </button>

                  <button
                    type="button"
                    className="leave-form-close-button"
                    onClick={removeDocument}
                    aria-label={t("Remove document")}
                  >
                    <X size={18} />
                  </button>

                </div>
              )}

            </div>
          )}

          {/* =================================================
              ERROR
              ================================================= */}

          {errorMessage && (
            <div className="leave-form-error">
              {errorMessage}
            </div>
          )}

          {/* =================================================
              SUCCESS
              ================================================= */}

          {successMessage && (
            <div className="leave-form-success">
              {successMessage}
            </div>
          )}

          {/* =================================================
              SUBMIT
              ================================================= */}

          <div className="leave-submit-section">

            <div className="leave-submit-info">
              <p>
                {t("Your application will be sent to the concerned faculty for approval.")}
              </p>
            </div>

            <button
              type="submit"
              className="leave-submit-button"
            >
              {t("Submit Application")}
            </button>

          </div>

        </form>
      </div>

      {/* =====================================================
          RECENT REQUESTS
          ===================================================== */}

      <div className="leave-history-section">

        <div className="leave-history-header">

          <div>
            <h2>{t("Recent Requests")}</h2>

            <p>
              {t("Track the status of your leave and OD applications.")}
            </p>
          </div>

        </div>

        {sortedRequests.length === 0 ? (
          <div className="leave-empty-state">
            <CalendarDays size={28} />

            <h3>
              {t("No requests yet")}
            </h3>

            <p>
              {t("Your submitted applications will appear here.")}
            </p>
          </div>
        ) : (
          <div className="leave-history-list">

            {sortedRequests.map((request) => (

              <div
                key={request.id}
                className="leave-history-card"
              >

                {/* TOP */}

                <div className="leave-history-card-top">

                  <div>

                    <div className="leave-history-title-row">

                      <h3>
                        {request.requestType ===
                        "Leave"
                          ? t(request.leaveType)
                          : t("On Duty (OD)")}
                      </h3>

                      <span
                        className={`leave-status leave-status-${request.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {t(request.status)}
                      </span>

                    </div>

                    <p className="leave-history-date">
                      {t("Applied on")}{" "}
                      {request.appliedDate}
                    </p>

                  </div>

                  <div className="leave-history-days">
                    <strong>
                      {request.days}
                    </strong>

                    <span>
                      {request.days === 1
                        ? "day"
                        : "days"}
                    </span>
                  </div>

                </div>

                {/* DETAILS */}

                <div className="leave-history-details">

                  <div>
                    <span>
                      From
                    </span>

                    <strong>
                      {request.fromDate}
                    </strong>
                  </div>

                  <div>
                    <span>
                      To
                    </span>

                    <strong>
                      {request.toDate}
                    </strong>
                  </div>

                  {request.requestType === "OD" && (
                    <div>
                      <span>
                        Event
                      </span>

                      <strong>
                        {request.eventName || "-"}
                      </strong>
                    </div>
                  )}

                </div>

                {/* REASON */}

                <div className="leave-history-reason">

                  <span>
                    Reason
                  </span>

                  <p>
                    {request.reason}
                  </p>

                </div>

                {/* DOCUMENT */}

                {request.documentName && (
                  <div className="leave-history-document">

                    <FileText size={16} />

                    <span>
                      {request.documentName}
                    </span>

                  </div>
                )}

                {/* APPROVAL */}

                {request.status === "Approved" &&
                  request.approvedBy && (
                    <div className="leave-approval-info">

                      Approved by{" "}
                      <strong>
                        {request.approvedBy}
                      </strong>

                      {request.approvedDate &&
                        ` on ${request.approvedDate}`}
                    </div>
                  )}

                {/* REJECTION */}

                {request.status === "Rejected" &&
                  request.rejectionReason && (
                    <div className="leave-rejection-info">

                      <strong>
                        Rejection reason:
                      </strong>{" "}
                      {request.rejectionReason}

                    </div>
                  )}

                {request.reminders?.length > 0 && (
                  <div className="leave-reminder-thread">
                    <strong>{t("In-app reminders")}</strong>
                    {request.reminders.map((reminder) => (
                      <p key={reminder.id}>
                        {reminder.message}
                        {reminder.sentAt && (
                          <time dateTime={reminder.sentAt}>
                            {new Date(reminder.sentAt).toLocaleString()}
                          </time>
                        )}
                      </p>
                    ))}
                  </div>
                )}

                {/* ACTION */}

                {request.status === "Pending" && (
                  <div className="leave-history-actions">

                    <label className="leave-reminder-compose">
                      <span>{t("Send an in-app reminder to your teacher")}</span>
                      <input
                        type="text"
                        value={reminderDrafts[request.id] || ""}
                        onChange={(event) =>
                          setReminderDrafts((drafts) => ({
                            ...drafts,
                            [request.id]: event.target.value,
                          }))
                        }
                        placeholder={t("Add a short, professional follow-up (optional)")}
                      />
                    </label>

                    <button
                      type="button"
                      className="leave-reminder-button"
                      onClick={() => handleSendReminder(request)}
                    >
                      {t("Send reminder to teacher")}
                    </button>

                    {reminderFeedback[request.id] && (
                      <p
                        className={`leave-reminder-feedback leave-reminder-feedback-${reminderFeedback[request.id].type}`}
                        role={reminderFeedback[request.id].type === "error" ? "alert" : "status"}
                      >
                        {t(reminderFeedback[request.id].message)}
                      </p>
                    )}

                    <button
                      type="button"
                      className="leave-cancel-button"
                      onClick={() =>
                        handleCancelRequest(
                          request.id
                        )
                      }
                    >
                      Cancel Request
                    </button>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Leave;