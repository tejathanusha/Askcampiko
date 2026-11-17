import {
  attendanceData,
  studentAssignments,
  studentData,
  teacherAssignments,
} from "./mockData";

const ATTENDANCE_STORAGE_KEY = "askcampiko.teacherAttendance";
const ASSIGNMENTS_STORAGE_KEY = "askcampiko.teacherCreatedAssignments";

function readArray(storageKey, label) {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error(`Saved ${label} must be an array.`);
    }
    return parsed;
  } catch (error) {
    console.error(`Unable to load ${label}.`, error);
    throw error;
  }
}

function writeArray(storageKey, entries, eventName, label) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
    window.dispatchEvent(new CustomEvent(eventName));
  } catch (error) {
    console.error(`Unable to save ${label}.`, error);
    throw error;
  }
}

export function getTeacherAttendanceSessions() {
  return readArray(ATTENDANCE_STORAGE_KEY, "teacher attendance");
}

export function saveTeacherAttendanceSession(session) {
  const sessions = getTeacherAttendanceSessions();
  const sessionKey = `${session.date}|${session.section}|${session.subject}|${session.period}`;
  const existingIndex = sessions.findIndex(
    (item) => item.sessionKey === sessionKey
  );
  const savedSession = {
    ...session,
    sessionKey,
    savedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    sessions[existingIndex] = savedSession;
  } else {
    sessions.push(savedSession);
  }

  writeArray(
    ATTENDANCE_STORAGE_KEY,
    sessions,
    "askCampikoTeacherAttendanceUpdated",
    "teacher attendance"
  );
}

export function getStudentAttendanceData(studentId, baseAttendance = attendanceData) {
  const attendance = Object.fromEntries(
    Object.entries(baseAttendance).map(([subject, counts]) => [
      subject,
      { ...counts },
    ])
  );

  getTeacherAttendanceSessions()
    .filter((session) => session.studentStatuses?.[studentId])
    .forEach((session) => {
      const subjectCounts = attendance[session.subject] || {
        conducted: 0,
        present: 0,
        absent: 0,
      };
      subjectCounts.conducted += 1;
      if (session.studentStatuses[studentId] === "Present") {
        subjectCounts.present += 1;
      } else {
        subjectCounts.absent += 1;
      }
      attendance[session.subject] = subjectCounts;
    });

  return attendance;
}

export function getTeacherAssignments() {
  return [...teacherAssignments, ...readArray(ASSIGNMENTS_STORAGE_KEY, "teacher assignments")];
}

export function createTeacherAssignment(assignment) {
  const assignments = readArray(ASSIGNMENTS_STORAGE_KEY, "teacher assignments");
  assignments.unshift({
    ...assignment,
    id: `TASSIGN${Date.now()}`,
    submissions: [],
    status: "Active",
  });
  writeArray(
    ASSIGNMENTS_STORAGE_KEY,
    assignments,
    "askCampikoTeacherAssignmentsUpdated",
    "teacher assignments"
  );
  return assignments[0];
}

export function getStudentAssignments() {
  const section = `${studentData.branch}-${studentData.section}`;
  const createdAssignments = readArray(ASSIGNMENTS_STORAGE_KEY, "teacher assignments")
    .filter((assignment) => assignment.section === section)
    .map((assignment) => {
      const submission = assignment.submissions?.find(
        (item) => item.studentId === studentData.id
      );
      return {
        ...assignment,
        teacherCreated: true,
        subjectCode: assignment.subjectCode || assignment.subject
          .split(/\s+/)
          .map((word) => word[0])
          .join("")
          .toUpperCase(),
        faculty: assignment.faculty || "Dr. Priya Sharma",
        assignedDate: assignment.startDate,
        deadline: assignment.endDate,
        deadlineTime: assignment.deadlineTime || "11:59 PM",
        totalMarks: assignment.totalMarks || 20,
        submissionStatus: submission ? "Submitted" : "Not Submitted",
        submittedFile: submission?.fileName || null,
        submittedAt: submission?.submittedAt || null,
      };
    });

  return [...createdAssignments, ...studentAssignments];
}

export function submitStudentAssignment(assignmentId, studentId, fileName) {
  const assignments = readArray(ASSIGNMENTS_STORAGE_KEY, "teacher assignments");
  const assignment = assignments.find((item) => item.id === assignmentId);
  if (!assignment) {
    throw new Error("The teacher-created assignment could not be found.");
  }

  const submittedAt = new Date().toISOString();
  const submissions = (assignment.submissions || []).filter(
    (item) => item.studentId !== studentId
  );
  submissions.push({ studentId, fileName, submittedAt });
  assignment.submissions = submissions;

  writeArray(
    ASSIGNMENTS_STORAGE_KEY,
    assignments,
    "askCampikoTeacherAssignmentsUpdated",
    "teacher assignments"
  );
}
