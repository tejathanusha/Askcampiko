import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  MapPin,
  Plane,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react";

import {
  getLeaveRequests,
  updateLeaveRequest,
} from "../../data/leaveRequestStore";

const LeaveApproval = () => {
  const [requests, setRequests] =
    useState(() => getLeaveRequests());

  const [filter, setFilter] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [showRejectBox, setShowRejectBox] =
    useState(false);

  useEffect(() => {
    const syncRequests = () => {
      setRequests(getLeaveRequests());
    };

    window.addEventListener(
      "storage",
      syncRequests
    );

    window.addEventListener(
      "askCampikoLeaveUpdated",
      syncRequests
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncRequests
      );

      window.removeEventListener(
        "askCampikoLeaveUpdated",
        syncRequests
      );
    };
  }, []);

  const totalRequests =
    requests.length;

  const pendingRequests =
    requests.filter(
      (request) =>
        request.status === "Pending"
    ).length;

  const approvedRequests =
    requests.filter(
      (request) =>
        request.status === "Approved"
    ).length;

  const rejectedRequests =
    requests.filter(
      (request) =>
        request.status === "Rejected"
    ).length;

  const filteredRequests =
    useMemo(() => {
      let result = [...requests];

      if (filter !== "All") {
        result = result.filter(
          (request) =>
            request.requestType === filter
        );
      }

      if (searchTerm.trim()) {
        const search =
          searchTerm
            .trim()
            .toLowerCase();

        result = result.filter(
          (request) =>
            request.studentName
              ?.toLowerCase()
              .includes(search) ||
            request.studentId
              ?.toLowerCase()
              .includes(search) ||
            request.section
              ?.toLowerCase()
              .includes(search) ||
            request.eventName
              ?.toLowerCase()
              .includes(search)
        );
      }

      return result;
    }, [
      requests,
      filter,
      searchTerm,
    ]);

  const openDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
    setShowRejectBox(false);
    setRejectionReason("");
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
    setShowRejectBox(false);
    setRejectionReason("");
  };

  const handleApprove = (id) => {
    const confirmApprove =
      window.confirm(
        "Approve this request?"
      );

    if (!confirmApprove) {
      return;
    }

    try {
      const updatedRequests =
        updateLeaveRequest(id, {
          status: "Approved",
          approvedBy: "Teacher",
          approvedDate:
            new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
          rejectionReason: "",
        });

      setRequests(updatedRequests);

      if (selectedRequest?.id === id) {
        setSelectedRequest(
          updatedRequests.find((request) => request.id === id)
        );
      }
    } catch (error) {
      console.error("Unable to approve the leave request.", error);
      alert("The request could not be approved. Please try again.");
    }
  };

  const handleReject = (id) => {
    if (!rejectionReason.trim()) {
      alert(
        "Please enter a rejection reason."
      );
      return;
    }

    const confirmReject =
      window.confirm(
        "Reject this request?"
      );

    if (!confirmReject) {
      return;
    }

    try {
      const updatedRequests =
        updateLeaveRequest(id, {
          status: "Rejected",
          rejectionReason: rejectionReason.trim(),
        });

      setRequests(updatedRequests);

      if (selectedRequest?.id === id) {
        setSelectedRequest(
          updatedRequests.find((request) => request.id === id)
        );
      }

      setShowRejectBox(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Unable to reject the leave request.", error);
      alert("The request could not be rejected. Please try again.");
    }
  };

  return (
    <div className="page-content teacher-leave-page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <h1>
            Leave & OD Requests
          </h1>

          <p>
            Review and manage student leave and
            on-duty applications.
          </p>
        </div>

      </div>

      {/* SUMMARY */}
      <div className="leave-summary-grid">

        <div className="leave-summary-card">

          <div className="leave-summary-icon">
            <FileText size={22} />
          </div>

          <div>
            <span>
              Total Requests
            </span>

            <strong>
              {totalRequests}
            </strong>
          </div>

        </div>

        <div className="leave-summary-card">

          <div className="leave-summary-icon warning">
            <Clock3 size={22} />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingRequests}
            </strong>
          </div>

        </div>

        <div className="leave-summary-card">

          <div className="leave-summary-icon success">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>
              Approved
            </span>

            <strong>
              {approvedRequests}
            </strong>
          </div>

        </div>

        <div className="leave-summary-card">

          <div className="leave-summary-icon danger">
            <XCircle size={22} />
          </div>

          <div>
            <span>
              Rejected
            </span>

            <strong>
              {rejectedRequests}
            </strong>
          </div>

        </div>

      </div>

      {/* FILTER AREA */}
      <div className="teacher-leave-toolbar">

        <div className="teacher-leave-filters">

          <button
            className={
              filter === "All"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("All")
            }
          >
            All
          </button>

          <button
            className={
              filter === "Leave"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("Leave")
            }
          >
            Leave
          </button>

          <button
            className={
              filter === "OD"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter("OD")
            }
          >
            OD
          </button>

        </div>

        <div className="teacher-leave-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search student or request..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>

      </div>

      {/* REQUEST LIST */}
      <div className="teacher-leave-request-list">

        {filteredRequests.length === 0 ? (
          <div className="leave-empty-state">

            <FileText size={40} />

            <h3>
              No requests found
            </h3>

            <p>
              There are no requests matching
              the selected filter.
            </p>

          </div>
        ) : (
          filteredRequests.map(
            (request) => (
              <div
                className="teacher-leave-request-card"
                key={request.id}
              >

                <div className="teacher-leave-request-icon">

                  {request.requestType ===
                  "OD" ? (
                    <Plane size={23} />
                  ) : (
                    <CalendarDays
                      size={23}
                    />
                  )}

                </div>

                <div className="teacher-leave-request-content">

                  <div className="teacher-leave-request-top">

                    <div className="teacher-request-title-row">

                      <div>
                        <h3>
                          {request.requestType ===
                          "OD"
                            ? "On-Duty Request"
                            : request.leaveType ||
                              "Leave Request"}
                        </h3>

                        <span className="teacher-request-student">
                          <User size={14} />

                          {request.studentName}

                          {" • "}

                          {request.studentId}

                          {" • "}

                          {request.section}
                        </span>
                      </div>

                      <span
                        className={`leave-status ${
                          request.status ===
                          "Approved"
                            ? "approved"
                            : request.status ===
                              "Rejected"
                            ? "rejected"
                            : "pending"
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                    <span className="teacher-request-date">
                      Applied{" "}
                      {request.appliedDate}
                    </span>

                  </div>

                  <div className="teacher-request-details">

                    <span>
                      <CalendarDays
                        size={15}
                      />

                      {request.fromDate}

                      {" - "}

                      {request.toDate}
                    </span>

                    <span>
                      <Clock3 size={15} />

                      {request.days}{" "}
                      {request.days === 1
                        ? "day"
                        : "days"}
                    </span>

                    {request.requestType ===
                      "OD" &&
                      request.eventName && (
                        <span>
                          <GraduationCap
                            size={15}
                          />

                          {request.eventName}
                        </span>
                      )}

                    {request.requestType ===
                      "OD" &&
                      request.venue && (
                        <span>
                          <MapPin size={15} />

                          {request.venue}
                        </span>
                      )}

                  </div>

                  <p className="teacher-request-reason">
                    {request.reason}
                  </p>

                  {request.documentName && (
                    <div className="teacher-request-document">
                      <FileText size={15} />

                      {request.documentName}
                    </div>
                  )}

                  <div className="teacher-request-actions">

                    <button
                      className="secondary-button"
                      onClick={() =>
                        openDetails(request)
                      }
                    >
                      View Details
                    </button>

                    {request.status ===
                      "Pending" && (
                      <>
                        <button
                          className="teacher-approve-button"
                          onClick={() =>
                            handleApprove(
                              request.id
                            )
                          }
                        >
                          <CheckCircle2
                            size={17}
                          />

                          Approve
                        </button>

                        <button
                          className="teacher-reject-button"
                          onClick={() => {
                            setSelectedRequest(
                              request
                            );

                            setShowDetails(
                              true
                            );

                            setShowRejectBox(
                              true
                            );
                          }}
                        >
                          <XCircle size={17} />

                          Reject
                        </button>
                      </>
                    )}

                  </div>

                </div>

              </div>
            )
          )
        )}

      </div>

      {/* DETAILS MODAL */}
      {showDetails &&
        selectedRequest && (
          <div
            className="teacher-leave-modal-overlay"
            onClick={closeDetails}
          >

            <div
              className="teacher-leave-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="teacher-leave-modal-header">

                <div>
                  <h2>
                    Request Details
                  </h2>

                  <p>
                    {
                      selectedRequest.requestType
                    }{" "}
                    application
                  </p>
                </div>

                <button
                  className="teacher-modal-close"
                  onClick={closeDetails}
                >
                  <X size={20} />
                </button>

              </div>

              {/* STUDENT */}
              <div className="teacher-modal-student">

                <div className="teacher-modal-student-icon">
                  <User size={21} />
                </div>

                <div>
                  <strong>
                    {
                      selectedRequest.studentName
                    }
                  </strong>

                  <span>
                    {
                      selectedRequest.studentId
                    }
                    {" • "}
                    {
                      selectedRequest.section
                    }
                  </span>
                </div>

              </div>

              {/* DETAILS */}
              <div className="teacher-modal-grid">

                <div>
                  <label className="teacher-modal-label">
                    Request Type
                  </label>

                  <strong>
                    {
                      selectedRequest.requestType
                    }
                  </strong>
                </div>

                {selectedRequest.requestType ===
                  "Leave" && (
                  <div>
                    <label className="teacher-modal-label">
                      Leave Type
                    </label>

                    <strong>
                      {
                        selectedRequest.leaveType
                      }
                    </strong>
                  </div>
                )}

                {selectedRequest.requestType ===
                  "OD" && (
                  <div>
                    <label className="teacher-modal-label">
                      OD Purpose
                    </label>

                    <strong>
                      {
                        selectedRequest.odPurpose
                      }
                    </strong>
                  </div>
                )}

                <div>
                  <label className="teacher-modal-label">
                    From Date
                  </label>

                  <strong>
                    {
                      selectedRequest.fromDate
                    }
                  </strong>
                </div>

                <div>
                  <label className="teacher-modal-label">
                    To Date
                  </label>

                  <strong>
                    {
                      selectedRequest.toDate
                    }
                  </strong>
                </div>

                <div>
                  <label className="teacher-modal-label">
                    Duration
                  </label>

                  <strong>
                    {selectedRequest.days}{" "}
                    {selectedRequest.days ===
                    1
                      ? "day"
                      : "days"}
                  </strong>
                </div>

                {selectedRequest.requestType ===
                  "OD" &&
                  selectedRequest.eventName && (
                    <div>
                      <label className="teacher-modal-label">
                        Event / Activity
                      </label>

                      <strong>
                        {
                          selectedRequest.eventName
                        }
                      </strong>
                    </div>
                  )}

                {selectedRequest.requestType ===
                  "OD" &&
                  selectedRequest.venue && (
                    <div>
                      <label className="teacher-modal-label">
                        Venue
                      </label>

                      <strong>
                        {
                          selectedRequest.venue
                        }
                      </strong>
                    </div>
                  )}

              </div>

              {/* REASON */}
              <div className="teacher-modal-reason">

                <label className="teacher-modal-label">
                  Reason
                </label>

                <p>
                  {
                    selectedRequest.reason
                  }
                </p>

              </div>

              {/* DOCUMENT */}
              {selectedRequest.documentName && (
                <div className="teacher-modal-document">

                  <FileText size={17} />

                  <span>
                    {
                      selectedRequest.documentName
                    }
                  </span>

                </div>
              )}

              {/* STATUS */}
              {selectedRequest.status ===
                "Approved" && (
                <div className="teacher-approved-banner">

                  <CheckCircle2 size={18} />

                  <span>
                    Approved by{" "}
                    {
                      selectedRequest.approvedBy
                    }

                    {selectedRequest.approvedDate &&
                      ` on ${selectedRequest.approvedDate}`}
                  </span>

                </div>
              )}

              {selectedRequest.status ===
                "Rejected" && (
                <div className="teacher-rejected-banner">

                  <XCircle size={18} />

                  <span>
                    Rejected:{" "}
                    {
                      selectedRequest.rejectionReason
                    }
                  </span>

                </div>
              )}

              {/* REJECTION BOX */}
              {showRejectBox &&
                selectedRequest.status ===
                  "Pending" && (
                  <div className="teacher-rejection-group">

                    <label>
                      Rejection Reason
                    </label>

                    <textarea
                      rows="3"
                      value={
                        rejectionReason
                      }
                      onChange={(event) =>
                        setRejectionReason(
                          event.target.value
                        )
                      }
                      placeholder="Enter reason for rejecting this request..."
                    />

                  </div>
                )}

              {/* ACTIONS */}
              <div className="teacher-modal-actions">

                <button
                  className="secondary-button"
                  onClick={closeDetails}
                >
                  Close
                </button>

                {selectedRequest.status ===
                  "Pending" && (
                  <>
                    {!showRejectBox && (
                      <button
                        className="teacher-reject-button"
                        onClick={() =>
                          setShowRejectBox(
                            true
                          )
                        }
                      >
                        <XCircle size={17} />

                        Reject
                      </button>
                    )}

                    {showRejectBox && (
                      <button
                        className="teacher-reject-button"
                        onClick={() =>
                          handleReject(
                            selectedRequest.id
                          )
                        }
                      >
                        <XCircle size={17} />

                        Confirm Rejection
                      </button>
                    )}

                    <button
                      className="teacher-approve-button"
                      onClick={() =>
                        handleApprove(
                          selectedRequest.id
                        )
                      }
                    >
                      <CheckCircle2
                        size={17}
                      />

                      Approve
                    </button>
                  </>
                )}

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

export default LeaveApproval;