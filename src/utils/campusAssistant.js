import {
  achievements,
  attendanceData,
  billingData,
  campusInfo,
  events,
  studentAssignments,
  studentData,
  studentLeaves,
  studentTimetable,
  teacherAssignments,
  teacherData,
  teacherLeaveRequests,
  teacherTimetable,
  teachingContent,
} from "../data/mockData";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const subjectAliases = {
  dbms: "Database Management Systems",
  database: "Database Management Systems",
  os: "Operating Systems",
  operating: "Operating Systems",
  java: "Java Programming",
  ai: "Artificial Intelligence",
  artificial: "Artificial Intelligence",
  ml: "Machine Learning",
  machine: "Machine Learning",
  cn: "Computer Networks",
  networks: "Computer Networks",
};

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getDayFromQuestion(question) {
  const day = weekdays.find((weekday) =>
    question.includes(weekday.toLowerCase())
  );

  if (day) {
    return day;
  }

  const date = new Date();
  if (question.includes("tomorrow")) {
    date.setDate(date.getDate() + 1);
  } else if (!question.includes("today")) {
    return null;
  }

  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function formatScheduleItem(item) {
  return `${item.subject}, ${item.startTime}–${item.endTime}, ${
    item.room || item.classroom || "room not listed"
  }${item.section ? ` (${item.section})` : ""}${
    item.faculty ? ` with ${item.faculty}` : ""
  }`;
}

function makeAnswer(answer, targetPage, assignmentId = null) {
  return { answer, targetPage, assignmentId };
}

function findSubject(question) {
  const subjectNames = Object.keys(teachingContent);
  const matchedName = subjectNames.find((subject) =>
    question.includes(normalize(subject))
  );
  if (matchedName) {
    return matchedName;
  }

  const matchedAlias = Object.entries(subjectAliases).find(([alias]) =>
    question.split(" ").includes(alias)
  );
  return matchedAlias?.[1] || null;
}

function listSchedule(schedule, question) {
  const selectedSubject = findSubject(question);
  const selectedDay = getDayFromQuestion(question);
  const rows = Object.entries(schedule).flatMap(([day, items]) =>
    items
      .filter((item) => {
        const sameSubject =
          !selectedSubject ||
          normalize(item.subject) === normalize(selectedSubject);
        const sameDay = !selectedDay || day === selectedDay;
        return sameSubject && sameDay;
      })
      .map((item) => ({ day, item }))
  );

  if (!rows.length) {
    const when = selectedDay ? ` on ${selectedDay}` : "";
    return makeAnswer(
      selectedSubject
        ? `I couldn't find ${selectedSubject}${when} in the available timetable. You can check the full timetable for details.`
        : `There are no classes scheduled${when} in the available timetable.`,
      "timetable"
    );
  }

  const heading = selectedSubject
    ? `${selectedSubject}${selectedDay ? ` on ${selectedDay}` : ""}`
    : selectedDay
      ? `${selectedDay}'s classes`
      : "Your timetable";
  const lines = rows.map(
    ({ day, item }) =>
      `${selectedSubject && !selectedDay ? `${day}: ` : ""}${formatScheduleItem(item)}`
  );

  return makeAnswer(`${heading}: ${lines.join("; ")}.`, "timetable");
}

export function getCampusAssistantResponse(input, role = "student") {
  const question = normalize(input);
  const isTeacher = role === "teacher";

  if (!question) {
    return makeAnswer("Type a question about your campus or a page in the app.");
  }

  const timetable = isTeacher ? teacherTimetable : studentTimetable;
  const matchedSubject = findSubject(question);
  const scheduleQuestion =
    /\b(schedule|timetable|class|classes|period|room|today|tomorrow|monday|tuesday|wednesday|thursday|friday)\b/.test(
      question
    );
  const topicQuestion =
    /\b(topic|topics|teach|teaching|learning|learn|covered|syllabus)\b/.test(
      question
    );

  if (matchedSubject && topicQuestion && !scheduleQuestion) {
    const subjectContent = teachingContent[matchedSubject];
    return makeAnswer(
      `${matchedSubject}: the current topic is ${subjectContent.current}. Upcoming topics include ${subjectContent.upcoming.join(", ")}.`,
      "teachingContent"
    );
  }

  const otherAppTopicQuestion =
    /\b(attendance|assignment|assignments|deadline|submission|event|events|fee|fees|billing|payment|leave|od|topic|topics|teaching|achievement|profile|settings|privacy|notification)\b/.test(
      question
    );

  if (scheduleQuestion || (matchedSubject && !otherAppTopicQuestion)) {
    return listSchedule(timetable, question);
  }

  if (/\b(attendance|absent|present)\b/.test(question)) {
    if (isTeacher) {
      return makeAnswer(
        "Open Attendance to manage student attendance for your classes.",
        "attendance"
      );
    }

    const rows = Object.entries(attendanceData)
      .filter(([subject]) => !matchedSubject || subject === matchedSubject)
      .map(([subject, values]) => {
        const percentage = values.conducted
          ? Math.round((values.present / values.conducted) * 100)
          : 0;
        return `${subject}: ${percentage}% (${values.present}/${values.conducted} classes attended)`;
      });

    return makeAnswer(
      rows.length
        ? `${matchedSubject ? "" : "Your attendance: "}${rows.join("; ")}.`
        : "No attendance details are available for that subject.",
      "attendance"
    );
  }

  if (/\b(assignment|assignments|deadline|due date|submission|submit)\b/.test(question)) {
    const assignments = isTeacher ? teacherAssignments : studentAssignments;
    const matches = assignments.filter((assignment) => {
      const searchable = normalize(
        `${assignment.title} ${assignment.subject} ${assignment.subjectCode || ""}`
      );
      return question
        .split(" ")
        .some((word) => word.length > 2 && searchable.includes(word));
    });
    const items = matches.length
      ? matches
      : assignments.filter((assignment) =>
          isTeacher
            ? assignment.status !== "Completed"
            : assignment.submissionStatus !== "Submitted"
        );

    const answer = items.length
      ? items
          .map((assignment) => {
            const status = isTeacher
              ? `${assignment.pending} submissions pending in ${assignment.section}`
              : assignment.submissionStatus;
            return `${assignment.title} (${assignment.subject}) is due ${assignment.deadline}; ${status}`;
          })
          .join("; ") + "."
      : "There are no pending assignments in the available records.";
    const assignmentId =
      !isTeacher && items.length === 1 ? items[0].id : null;

    return makeAnswer(
      answer,
      isTeacher ? "assignments" : assignmentId ? "assignments" : "assignments",
      assignmentId
    );
  }

  if (/\b(event|events|hackathon|fest|workshop)\b/.test(question)) {
    const matchedEvents = events.filter((event) => {
      const searchable = normalize(`${event.title} ${event.description}`);
      return question
        .split(" ")
        .some((word) => word.length > 3 && searchable.includes(word));
    });
    const items = matchedEvents.length
      ? matchedEvents
      : events.filter((event) => event.status === "ongoing" || event.status === "upcoming");

    return makeAnswer(
      items.length
        ? items
            .map(
              (event) =>
                `${event.title} is ${event.status}; it takes place ${event.eventDate} at ${event.location}${
                  event.deadline ? ` (applications close ${event.deadline})` : ""
                }`
            )
            .join("; ") + "."
        : "No current or upcoming events are listed.",
      "events"
    );
  }

  if (/\b(fee|fees|billing|bill|payment|balance|due)\b/.test(question)) {
    return makeAnswer(
      `Your fees total ₹${billingData.totalFees.toLocaleString("en-IN")}; ₹${billingData.paidAmount.toLocaleString("en-IN")} is paid and ₹${billingData.dueAmount.toLocaleString("en-IN")} is due by ${billingData.dueDate}.`,
      "billing"
    );
  }

  if (/\b(leave|od|on duty|absence)\b/.test(question)) {
    const items = isTeacher ? teacherLeaveRequests : studentLeaves;
    const answer = isTeacher
      ? `${items.filter((item) => item.status === "Pending").length} leave/OD requests are pending review.`
      : items.length
        ? `Your recorded requests: ${items
            .map(
              (item) =>
                `${item.type}, ${item.fromDate} to ${item.toDate} (${item.status})`
            )
            .join("; ")}.`
        : "You have no leave or OD requests on record.";

    return makeAnswer(
      answer,
      isTeacher ? "studentLeaveApproval" : "leave"
    );
  }

  if (/\b(topic|topics|teaching content|covered|syllabus)\b/.test(question)) {
    const subject = matchedSubject || Object.keys(teachingContent)[0];
    const content = teachingContent[subject];

    return makeAnswer(
      `${subject}: the current topic is ${content.current}. Upcoming topics include ${content.upcoming.join(", ")}.`,
      "teachingContent"
    );
  }

  if (/\b(achievement|achievements|award|competition|winner)\b/.test(question)) {
    return makeAnswer(
      achievements.length
        ? `You have ${achievements.length} recorded achievements: ${achievements
            .map((item) => `${item.title} (${item.result}, ${item.year})`)
            .join("; ")}.`
        : "No achievements have been recorded yet.",
      "achievementHistory"
    );
  }

  if (/\b(campus|location|building|library|cafeteria|emergency|alert)\b/.test(question)) {
    const locations = campusInfo.locations
      .map((location) => `${location.name} (${location.type})`)
      .join(", ");
    return makeAnswer(
      `${campusInfo.status}. ${campusInfo.alert} Campus locations: ${locations}. Emergency contact: ${campusInfo.emergencyContact}.`,
      "home"
    );
  }

  if (/\b(profile|my account|student id|roll number|email)\b/.test(question)) {
    const user = isTeacher ? teacherData : studentData;
    const identifier = isTeacher ? "Faculty ID" : "Roll number";
    const value = isTeacher ? user.id : user.rollNumber;
    return makeAnswer(
      `${user.fullName}: ${identifier} ${value}; email ${user.email}.`,
      "profile"
    );
  }

  if (/\b(settings|password|privacy|notification|language|dark mode|theme)\b/.test(question)) {
    return makeAnswer(
      "You can manage your account preferences, notifications, appearance and privacy in Settings.",
      "settings"
    );
  }

  return makeAnswer(
    "I can answer questions using the information in this app about your timetable, attendance, assignments, events, fees, leave requests, teaching content, achievements, profile and campus information. Try asking about one of those."
  );
}
