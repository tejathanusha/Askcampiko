import { studentData } from "./mockData";

const STORAGE_KEY = "askCampikoLeaveRequests";

const defaultStudent = {
  studentName: studentData.fullName || studentData.name,
  studentId: studentData.id,
  section: `${studentData.branch} ${studentData.section}`,
};

const defaultRequests = [
  {
    id: "REQ001",
    requestType: "OD",
    ...defaultStudent,

    leaveType: "",

    odPurpose: "Hackathon",
    eventName: "AI Innovation Hackathon",
    venue: "Chennai Trade Centre",

    fromDate: "02 Oct 2026",
    toDate: "03 Oct 2026",
    days: 2,

    reason:
      "Participating in the AI Innovation Hackathon representing the college.",

    documentName: "Hackathon_Invitation.pdf",

    status: "Pending",

    appliedDate: "30 Sep 2026",
  },

  {
    id: "REQ002",
    requestType: "Leave",
    ...defaultStudent,

    leaveType: "Casual Leave",

    odPurpose: "",
    eventName: "",
    venue: "",

    fromDate: "05 Oct 2026",
    toDate: "05 Oct 2026",
    days: 1,

    reason:
      "Personal work requiring leave for one day.",

    documentName: "",

    status: "Approved",

    appliedDate: "28 Sep 2026",

    approvedBy: "Class Advisor",
    approvedDate: "29 Sep 2026",
  },
];

export const getLeaveRequests = () => {
  try {
    const storedRequests =
      localStorage.getItem(STORAGE_KEY);

    if (!storedRequests) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultRequests)
      );

      return defaultRequests;
    }

    const parsedRequests = JSON.parse(storedRequests);
    if (!Array.isArray(parsedRequests)) {
      throw new Error("Saved leave requests must be an array.");
    }

    const seedRequestsById = new Map(
      defaultRequests.map((request) => [request.id, request])
    );
    const normalizedRequests = parsedRequests.map((request) => {
      const seedRequest = seedRequestsById.get(request.id);
      return seedRequest
        ? {
            ...request,
            ...defaultStudent,
          }
        : request;
    });

    if (
      JSON.stringify(normalizedRequests) !==
      JSON.stringify(parsedRequests)
    ) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalizedRequests)
      );
    }

    return normalizedRequests;
  } catch (error) {
    console.error(
      "Unable to load leave requests:",
      error
    );

    return defaultRequests;
  }
};

export const saveLeaveRequests = (requests) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(requests)
    );

    window.dispatchEvent(
      new CustomEvent("askCampikoLeaveUpdated")
    );
  } catch (error) {
    console.error(
      "Unable to save leave requests:",
      error
    );
    throw error;
  }
};

export const addLeaveRequest = (request) => {
  const currentRequests = getLeaveRequests();
  const savedRequest = {
    ...request,
    createdAt: request.createdAt || new Date().toISOString(),
    reminders: Array.isArray(request.reminders) ? request.reminders : [],
  };

  const updatedRequests = [
    savedRequest,
    ...currentRequests,
  ];

  saveLeaveRequests(updatedRequests);

  return updatedRequests;
};

export const updateLeaveRequest = (
  requestId,
  updates
) => {
  const updatedAt = new Date().toISOString();
  const currentRequests = getLeaveRequests();

  const updatedRequests = currentRequests.map(
    (request) =>
      request.id === requestId
        ? {
            ...request,
            ...updates,
            updatedAt: updates.updatedAt || updatedAt,
          }
        : request
  );

  saveLeaveRequests(updatedRequests);

  return updatedRequests;
};

export const addLeaveReminder = (requestId, studentId, message) => {
  const currentRequests = getLeaveRequests();
  const request = currentRequests.find(
    (item) =>
      item.id === requestId &&
      item.studentId === studentId &&
      item.status === "Pending"
  );

  if (!request) {
    return null;
  }

  const reminder = {
    id: `REM${Date.now()}`,
    message,
    sentAt: new Date().toISOString(),
  };
  const updatedRequests = currentRequests.map((item) =>
    item.id === requestId
      ? {
          ...item,
          reminders: [...(Array.isArray(item.reminders) ? item.reminders : []), reminder],
          updatedAt: reminder.sentAt,
        }
      : item
  );

  saveLeaveRequests(updatedRequests);
  return { requests: updatedRequests, reminder };
};

export const removeLeaveRequest = (requestId) => {
  const currentRequests = getLeaveRequests();

  const updatedRequests = currentRequests.filter(
    (request) => request.id !== requestId
  );

  saveLeaveRequests(updatedRequests);

  return updatedRequests;
};