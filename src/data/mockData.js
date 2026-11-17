// ============================================================
// ASK CAMPIKO - MOCK DATABASE
// ============================================================

// ============================================================
// STUDENT
// ============================================================

export const studentData = {
  id: "STU2026001",
  name: "Thanusha",
  fullName: "Thanusha Reddy",
  rollNumber: "23CSE001",
  branch: "CSE",
  year: 3,
  section: "B",
  semester: 5,

  email: "thanusha.reddy@example.com",
  phone: "+91 98765 43210",

  mentor: "Dr. Priya Sharma",
  fas: "Dr. Priya Sharma",

  profileImage: null,
};


// ============================================================
// BRANCHES
// ============================================================

export const branches = [
  {
    code: "CSE",
    name: "Computer Science and Engineering",
  },
  {
    code: "ECE",
    name: "Electronics and Communication Engineering",
  },
  {
    code: "EEE",
    name: "Electrical and Electronics Engineering",
  },
  {
    code: "MECH",
    name: "Mechanical Engineering",
  },
  {
    code: "CIVIL",
    name: "Civil Engineering",
  },
  {
    code: "AIML",
    name: "Artificial Intelligence and Machine Learning",
  },
];


// ============================================================
// SECTIONS
// ============================================================

export const sections = [
  "A",
  "B",
  "C",
];


// ============================================================
// SUBJECTS
// ============================================================

export const subjects = [
  {
    code: "DBMS",
    name: "Database Management Systems",
  },
  {
    code: "OS",
    name: "Operating Systems",
  },
  {
    code: "JAVA",
    name: "Java Programming",
  },
  {
    code: "AI",
    name: "Artificial Intelligence",
  },
  {
    code: "ML",
    name: "Machine Learning",
  },
  {
    code: "CN",
    name: "Computer Networks",
  },
];


// ============================================================
// STUDENT TIMETABLE
// ============================================================

export const studentTimetable = {
  Monday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Database Management Systems",
      faculty: "Dr. Priya Sharma",
      room: "CSE-204",
      section: "B",
    },
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Operating Systems",
      faculty: "Dr. Arun Kumar",
      room: "CSE-205",
      section: "B",
    },
    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Java Programming",
      faculty: "Ms. Kavya Rao",
      room: "CSE-201",
      section: "B",
    },
    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Meera Nair",
      room: "AI-101",
      section: "B",
    },
    {
      period: 5,
      startTime: "01:40 PM",
      endTime: "02:30 PM",
      subject: "Machine Learning",
      faculty: "Dr. Kiran Rao",
      room: "ML-102",
      section: "B",
    },
    {
      period: 6,
      startTime: "02:30 PM",
      endTime: "03:20 PM",
      subject: "Computer Networks",
      faculty: "Mr. Vivek Kumar",
      room: "CSE-203",
      section: "B",
    },
  ],

  Tuesday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Operating Systems",
      faculty: "Dr. Arun Kumar",
      room: "CSE-205",
      section: "B",
    },
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Database Management Systems",
      faculty: "Dr. Priya Sharma",
      room: "CSE-204",
      section: "B",
    },
    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Machine Learning",
      faculty: "Dr. Kiran Rao",
      room: "ML-102",
      section: "B",
    },
    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Computer Networks",
      faculty: "Mr. Vivek Kumar",
      room: "CSE-203",
      section: "B",
    },
    {
      period: 5,
      startTime: "01:40 PM",
      endTime: "02:30 PM",
      subject: "Java Programming",
      faculty: "Ms. Kavya Rao",
      room: "CSE-201",
      section: "B",
    },
    {
      period: 6,
      startTime: "02:30 PM",
      endTime: "03:20 PM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Meera Nair",
      room: "AI-101",
      section: "B",
    },
  ],

  Wednesday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Meera Nair",
      room: "AI-101",
      section: "B",
    },
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Computer Networks",
      faculty: "Mr. Vivek Kumar",
      room: "CSE-203",
      section: "B",
    },
    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Database Management Systems",
      faculty: "Dr. Priya Sharma",
      room: "CSE-204",
      section: "B",
    },
    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Machine Learning",
      faculty: "Dr. Kiran Rao",
      room: "ML-102",
      section: "B",
    },
    {
      period: 5,
      startTime: "01:40 PM",
      endTime: "02:30 PM",
      subject: "Operating Systems",
      faculty: "Dr. Arun Kumar",
      room: "CSE-205",
      section: "B",
    },
    {
      period: 6,
      startTime: "02:30 PM",
      endTime: "03:20 PM",
      subject: "Java Programming",
      faculty: "Ms. Kavya Rao",
      room: "CSE-201",
      section: "B",
    },
  ],

  Thursday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Machine Learning",
      faculty: "Dr. Kiran Rao",
      room: "ML-102",
      section: "B",
    },
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Java Programming",
      faculty: "Ms. Kavya Rao",
      room: "CSE-201",
      section: "B",
    },
    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Operating Systems",
      faculty: "Dr. Arun Kumar",
      room: "CSE-205",
      section: "B",
    },
    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Database Management Systems",
      faculty: "Dr. Priya Sharma",
      room: "CSE-204",
      section: "B",
    },
    {
      period: 5,
      startTime: "01:40 PM",
      endTime: "02:30 PM",
      subject: "Computer Networks",
      faculty: "Mr. Vivek Kumar",
      room: "CSE-203",
      section: "B",
    },
    {
      period: 6,
      startTime: "02:30 PM",
      endTime: "03:20 PM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Meera Nair",
      room: "AI-101",
      section: "B",
    },
  ],

  Friday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Computer Networks",
      faculty: "Mr. Vivek Kumar",
      room: "CSE-203",
      section: "B",
    },
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Artificial Intelligence",
      faculty: "Dr. Meera Nair",
      room: "AI-101",
      section: "B",
    },
    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Java Programming",
      faculty: "Ms. Kavya Rao",
      room: "CSE-201",
      section: "B",
    },
    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Machine Learning",
      faculty: "Dr. Kiran Rao",
      room: "ML-102",
      section: "B",
    },
    {
      period: 5,
      startTime: "01:40 PM",
      endTime: "02:30 PM",
      subject: "Database Management Systems",
      faculty: "Dr. Priya Sharma",
      room: "CSE-204",
      section: "B",
    },
    {
      period: 6,
      startTime: "02:30 PM",
      endTime: "03:20 PM",
      subject: "Operating Systems",
      faculty: "Dr. Arun Kumar",
      room: "CSE-205",
      section: "B",
    },
  ],
};


// ============================================================
// STUDENT ATTENDANCE
// ============================================================

export const attendanceData = {
  "Database Management Systems": {
    conducted: 40,
    present: 34,
    absent: 6,
  },

  "Operating Systems": {
    conducted: 36,
    present: 27,
    absent: 9,
  },

  "Java Programming": {
    conducted: 42,
    present: 30,
    absent: 12,
  },

  "Artificial Intelligence": {
    conducted: 35,
    present: 32,
    absent: 3,
  },

  "Machine Learning": {
    conducted: 38,
    present: 34,
    absent: 4,
  },

  "Computer Networks": {
    conducted: 32,
    present: 28,
    absent: 4,
  },
};


// ============================================================
// STUDENT ASSIGNMENTS
// ============================================================

export const studentAssignments = [
  {
    id: "ASSIGN001",
    subject: "Database Management Systems",
    subjectCode: "DBMS",
    title: "Normalization Assignment",
    description:
      "Solve the given database normalization problems and convert the provided relations into appropriate normal forms.",
    faculty: "Dr. Priya Sharma",
    assignedDate: "28 September 2026",
    deadline: "02 October 2026",
    deadlineTime: "11:59 PM",
    status: "pending",
    submissionStatus: "Not Submitted",
    submittedFile: null,
    submittedAt: null,
    totalMarks: 20,
  },

  {
    id: "ASSIGN002",
    subject: "Operating Systems",
    subjectCode: "OS",
    title: "CPU Scheduling Algorithms",
    description:
      "Prepare a comparative analysis of FCFS, SJF, Priority Scheduling and Round Robin algorithms with suitable examples.",
    faculty: "Dr. Arun Kumar",
    assignedDate: "27 September 2026",
    deadline: "04 October 2026",
    deadlineTime: "11:59 PM",
    status: "pending",
    submissionStatus: "Not Submitted",
    submittedFile: null,
    submittedAt: null,
    totalMarks: 25,
  },

  {
    id: "ASSIGN003",
    subject: "Machine Learning",
    subjectCode: "ML",
    title: "Linear Regression Mini Project",
    description:
      "Build a simple linear regression model using the provided dataset and explain the results in a short report.",
    faculty: "Dr. Kiran Rao",
    assignedDate: "25 September 2026",
    deadline: "07 October 2026",
    deadlineTime: "11:59 PM",
    status: "pending",
    submissionStatus: "Not Submitted",
    submittedFile: null,
    submittedAt: null,
    totalMarks: 30,
  },

  {
    id: "ASSIGN004",
    subject: "Artificial Intelligence",
    subjectCode: "AI",
    title: "Search Algorithms Report",
    description:
      "Prepare a report explaining BFS, DFS, Uniform Cost Search and A* search with suitable examples.",
    faculty: "Dr. Meera Nair",
    assignedDate: "20 September 2026",
    deadline: "28 September 2026",
    deadlineTime: "11:59 PM",
    status: "submitted",
    submissionStatus: "Submitted",
    submittedFile: "AI_Search_Algorithms.pdf",
    submittedAt: "27 September 2026",
    totalMarks: 20,
  },
];


// ============================================================
// CAMPUS EVENTS
// ============================================================

export const events = [
  {
    id: "EVENT001",
    title: "AI Innovation Hackathon",
    status: "ongoing",

    description:
      "Build innovative AI-powered solutions for real-world problems and compete with student teams.",

    applicationStart: "20 September 2026",
    deadline: "05 October 2026",
    eventDate: "10 October 2026",

    location: "Innovation Lab",
    organizer: "Computer Science Department",

    // Fake demo URL - replace later with the real link.
    link:
      "https://example.com/ai-innovation-hackathon",
  },

  {
    id: "EVENT002",
    title: "Campus Tech Fest",
    status: "upcoming",

    description:
      "A campus-wide technology festival featuring project exhibitions, technical competitions and workshops.",

    applicationStart: "25 September 2026",
    deadline: "12 October 2026",
    eventDate: "18 October 2026",

    location: "Main Auditorium",
    organizer: "Student Technical Council",

    link:
      "https://example.com/campus-tech-fest",
  },

  {
    id: "EVENT003",
    title: "Code Sprint 2026",
    status: "upcoming",

    description:
      "Participate in a competitive programming challenge covering algorithms, data structures and problem solving.",

    applicationStart: "28 September 2026",
    deadline: "15 October 2026",
    eventDate: "20 October 2026",

    location: "Programming Lab",
    organizer: "Coding Club",

    link:
      "https://example.com/code-sprint-2026",
  },

  {
    id: "EVENT004",
    title: "IoT Project Expo",
    status: "completed",

    description:
      "Student teams showcase innovative Internet of Things projects and smart campus solutions.",

    applicationStart: "01 September 2026",
    deadline: "15 September 2026",
    eventDate: "22 September 2026",

    location: "Engineering Block",
    organizer: "Electronics Department",

    link:
      "https://example.com/iot-project-expo",
  },
];


// ============================================================
// TEACHING CONTENT
// ============================================================

export const teachingContent = {
  "Database Management Systems": {
    covered: [
      "Introduction to DBMS",
      "ER Model",
      "Relational Model",
      "SQL Basics",
      "Normalization",
    ],

    current:
      "Functional Dependencies",

    upcoming: [
      "Transaction Management",
      "Concurrency Control",
      "Database Recovery",
    ],
  },

  "Operating Systems": {
    covered: [
      "Introduction to Operating Systems",
      "Process Management",
      "Threads",
      "CPU Scheduling",
    ],

    current:
      "Process Synchronization",

    upcoming: [
      "Deadlocks",
      "Memory Management",
      "Virtual Memory",
    ],
  },

  "Java Programming": {
    covered: [
      "Java Basics",
      "Classes and Objects",
      "Inheritance",
      "Polymorphism",
    ],

    current:
      "Exception Handling",

    upcoming: [
      "Collections",
      "Multithreading",
      "File Handling",
    ],
  },

  "Artificial Intelligence": {
    covered: [
      "Introduction to AI",
      "Intelligent Agents",
      "Problem Solving",
      "Search Algorithms",
    ],

    current:
      "Knowledge Representation",

    upcoming: [
      "Machine Learning Basics",
      "Expert Systems",
      "Natural Language Processing",
    ],
  },

  "Machine Learning": {
    covered: [
      "Introduction to ML",
      "Data Preprocessing",
      "Linear Regression",
      "Classification",
    ],

    current:
      "Decision Trees",

    upcoming: [
      "Clustering",
      "Dimensionality Reduction",
      "Model Evaluation",
    ],
  },

  "Computer Networks": {
    covered: [
      "Introduction to Networks",
      "OSI Model",
      "TCP/IP",
      "Data Link Layer",
    ],

    current:
      "Network Layer",

    upcoming: [
      "Transport Layer",
      "Application Layer",
      "Network Security",
    ],
  },
};


// ============================================================
// STUDENT LEAVE
// ============================================================

export const studentLeaves = [
  {
    id: "LEAVE001",
    type: "Medical Leave",
    fromDate: "15 September 2026",
    toDate: "16 September 2026",
    reason: "Medical appointment",
    status: "Approved",
  },

  {
    id: "LEAVE002",
    type: "OD",
    fromDate: "05 September 2026",
    toDate: "06 September 2026",
    reason: "Inter-college technical event",
    status: "Approved",
  },
];


// ============================================================
// ACHIEVEMENTS
// ============================================================

export const achievements = [
  {
    id: "ACH001",
    title: "Smart India Hackathon",
    type: "Hackathon",
    year: 2026,
    result: "Participated",
    organization: "College Innovation Cell",
  },

  {
    id: "ACH002",
    title: "Code Sprint",
    type: "Coding Competition",
    year: 2026,
    result: "Finalist",
    organization: "Coding Club",
  },

  {
    id: "ACH003",
    title: "AI Project Expo",
    type: "Project Exhibition",
    year: 2025,
    result: "Winner",
    organization: "CSE Department",
  },
];


// ============================================================
// BILLING
// ============================================================

export const billingData = {
  totalFees: 125000,
  paidAmount: 100000,
  dueAmount: 25000,
  dueDate: "10 Oct 2026",
  paymentStatus: "Partially Paid",

  feeDetails: [
    {
      id: "FEE001",
      category: "Tuition Fee",
      semester: "Semester 5",
      amount: 80000,
      paidAmount: 80000,
      status: "Paid",
    },
    {
      id: "FEE002",
      category: "Examination Fee",
      semester: "Semester 5",
      amount: 10000,
      paidAmount: 10000,
      status: "Paid",
    },
    {
      id: "FEE003",
      category: "Library Fee",
      semester: "Semester 5",
      amount: 5000,
      paidAmount: 5000,
      status: "Paid",
    },
    {
      id: "FEE004",
      category: "Development Fee",
      semester: "Academic Year 2026",
      amount: 15000,
      paidAmount: 5000,
      status: "Partially Paid",
    },
    {
      id: "FEE005",
      category: "Other Academic Charges",
      semester: "Academic Year 2026",
      amount: 15000,
      paidAmount: 0,
      status: "Pending",
    },
  ],

  paymentHistory: [
    {
      id: "TXN001",
      transactionId: "AC2026TXN001",
      date: "05 Sep 2026",
      amount: 50000,
      method: "UPI",
      status: "Paid",
      receiptNumber: "REC-2026-001",
      feeType: "Semester Fee Payment",
    },
    {
      id: "TXN002",
      transactionId: "AC2026TXN002",
      date: "15 Sep 2026",
      amount: 50000,
      method: "UPI",
      status: "Paid",
      receiptNumber: "REC-2026-002",
      feeType: "Semester Fee Payment",
    },
  ],
};
// ============================================================
// TEACHER
// ============================================================

export const teacherData = {
  id: "FAC2026001",
  name: "Dr. Priya Sharma",
  fullName: "Dr. Priya Sharma",

  department: "Computer Science and Engineering",
  branch: "CSE",

  designation: "Assistant Professor",

  email: "priya.sharma@example.com",
  phone: "+91 98765 12345",

  subjects: [
    "Database Management Systems",
    "Operating Systems",
  ],

  sections: [
    "CSE-A",
    "CSE-B",
    "CSE-C",
  ],
};

export const teacherCourseProgress = {
  "Database Management Systems": {
    completedClasses: 42,
    targetClasses: 60,
  },
  "Operating Systems": {
    completedClasses: 36,
    targetClasses: 54,
  },
};

export const teacherTeachingPlan = {
  Monday: [
    {
      subject: "Database Management Systems",
      section: "CSE-B",
      topic: "Functional Dependencies",
    },
    {
      subject: "Operating Systems",
      section: "CSE-A",
      topic: "Process Synchronization",
    },
  ],
  Tuesday: [
    {
      subject: "Database Management Systems",
      section: "CSE-A",
      topic: "Transaction Management",
    },
    {
      subject: "Operating Systems",
      section: "CSE-C",
      topic: "Deadlocks",
    },
  ],
  Wednesday: [
    {
      subject: "Operating Systems",
      section: "CSE-B",
      topic: "Memory Management",
    },
    {
      subject: "Database Management Systems",
      section: "CSE-C",
      topic: "Concurrency Control",
    },
  ],
  Thursday: [
    {
      subject: "Operating Systems",
      section: "CSE-A",
      topic: "Virtual Memory",
    },
    {
      subject: "Database Management Systems",
      section: "CSE-B",
      topic: "Database Recovery",
    },
  ],
  Friday: [
    {
      subject: "Database Management Systems",
      section: "CSE-A",
      topic: "Indexing and Query Optimization",
    },
    {
      subject: "Operating Systems",
      section: "CSE-C",
      topic: "File Systems",
    },
  ],
};

export const teacherBacklog = [
  {
    subject: "Database Management Systems",
    section: "CSE-B",
    topic: "Functional Dependencies",
    scheduledDate: "30 Oct 2026",
    reason: "Class not conducted",
  },
  {
    subject: "Operating Systems",
    section: "CSE-A",
    topic: "Process Synchronization",
    scheduledDate: "29 Oct 2026",
    reason: "Class not conducted",
  },
];

export const teacherClassRosters = {
  "CSE-A": [
    { id: "STU2026011", name: "Aarav Kumar", rollNumber: "23CSE011", attendance: { "Database Management Systems": { conducted: 40, present: 36 }, "Operating Systems": { conducted: 36, present: 31 } } },
    { id: "STU2026012", name: "Diya Sharma", rollNumber: "23CSE012", attendance: { "Database Management Systems": { conducted: 40, present: 38 }, "Operating Systems": { conducted: 36, present: 34 } } },
    { id: "STU2026013", name: "Ishaan Patel", rollNumber: "23CSE013", attendance: { "Database Management Systems": { conducted: 40, present: 32 }, "Operating Systems": { conducted: 36, present: 29 } } },
    { id: "STU2026014", name: "Meera Nair", rollNumber: "23CSE014", attendance: { "Database Management Systems": { conducted: 40, present: 35 }, "Operating Systems": { conducted: 36, present: 33 } } },
  ],
  "CSE-B": [
    { id: studentData.id, name: studentData.fullName, rollNumber: studentData.rollNumber, attendance: attendanceData },
    { id: "STU2026022", name: "Rahul Kumar", rollNumber: "23CSE022", attendance: { "Database Management Systems": { conducted: 40, present: 37 }, "Operating Systems": { conducted: 36, present: 30 } } },
    { id: "STU2026023", name: "Ananya Rao", rollNumber: "23CSE023", attendance: { "Database Management Systems": { conducted: 40, present: 33 }, "Operating Systems": { conducted: 36, present: 32 } } },
    { id: "STU2026024", name: "Vikram Reddy", rollNumber: "23CSE024", attendance: { "Database Management Systems": { conducted: 40, present: 39 }, "Operating Systems": { conducted: 36, present: 35 } } },
  ],
  "CSE-C": [
    { id: "STU2026031", name: "Sana Khan", rollNumber: "23CSE031", attendance: { "Database Management Systems": { conducted: 40, present: 35 }, "Operating Systems": { conducted: 36, present: 34 } } },
    { id: "STU2026032", name: "Rohan Das", rollNumber: "23CSE032", attendance: { "Database Management Systems": { conducted: 40, present: 31 }, "Operating Systems": { conducted: 36, present: 28 } } },
    { id: "STU2026033", name: "Kavya Iyer", rollNumber: "23CSE033", attendance: { "Database Management Systems": { conducted: 40, present: 38 }, "Operating Systems": { conducted: 36, present: 32 } } },
    { id: "STU2026034", name: "Aditya Verma", rollNumber: "23CSE034", attendance: { "Database Management Systems": { conducted: 40, present: 34 }, "Operating Systems": { conducted: 36, present: 30 } } },
  ],
};


// ============================================================
// TEACHER TIMETABLE
// ============================================================

export const teacherTimetable = {
  Monday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Database Management Systems",
      section: "CSE-B",
      room: "CSE-204",
    },

    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Operating Systems",
      section: "CSE-A",
      room: "CSE-205",
    },
  ],

  Tuesday: [
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Database Management Systems",
      section: "CSE-A",
      room: "CSE-204",
    },

    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Operating Systems",
      section: "CSE-C",
      room: "CSE-205",
    },
  ],

  Wednesday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Operating Systems",
      section: "CSE-B",
      room: "CSE-205",
    },

    {
      period: 3,
      startTime: "11:00 AM",
      endTime: "11:50 AM",
      subject: "Database Management Systems",
      section: "CSE-C",
      room: "CSE-204",
    },
  ],

  Thursday: [
    {
      period: 2,
      startTime: "09:50 AM",
      endTime: "10:40 AM",
      subject: "Operating Systems",
      section: "CSE-A",
      room: "CSE-205",
    },

    {
      period: 5,
      startTime: "01:40 PM",
      endTime: "02:30 PM",
      subject: "Database Management Systems",
      section: "CSE-B",
      room: "CSE-204",
    },
  ],

  Friday: [
    {
      period: 1,
      startTime: "09:00 AM",
      endTime: "09:50 AM",
      subject: "Database Management Systems",
      section: "CSE-A",
      room: "CSE-204",
    },

    {
      period: 4,
      startTime: "11:50 AM",
      endTime: "12:40 PM",
      subject: "Operating Systems",
      section: "CSE-C",
      room: "CSE-205",
    },
  ],
};


// ============================================================
// TEACHER ASSIGNMENTS
// ============================================================

export const teacherAssignments = [
  {
    id: "TASSIGN001",
    subject: "Database Management Systems",
    title: "Normalization Assignment",
    section: "CSE-B",
    assignedDate: "28 September 2026",
    deadline: "02 October 2026",

    totalStudents: 45,
    submitted: 32,
    pending: 13,

    status: "Active",
  },

  {
    id: "TASSIGN002",
    subject: "Operating Systems",
    title: "CPU Scheduling Algorithms",
    section: "CSE-A",
    assignedDate: "27 September 2026",
    deadline: "04 October 2026",

    totalStudents: 48,
    submitted: 29,
    pending: 19,

    status: "Active",
  },

  {
    id: "TASSIGN003",
    subject: "Database Management Systems",
    title: "SQL Query Practice",
    section: "CSE-C",
    assignedDate: "25 September 2026",
    deadline: "08 October 2026",

    totalStudents: 44,
    submitted: 44,
    pending: 0,

    status: "Completed",
  },
];


// ============================================================
// TEACHER LEAVE REQUESTS
// ============================================================

export const teacherLeaveRequests = [
  {
    id: "TL001",
    studentName: "Rahul Kumar",
    rollNumber: "23CSE012",
    section: "CSE-B",
    type: "Medical Leave",
    fromDate: "01 October 2026",
    toDate: "02 October 2026",
    reason: "Medical appointment",
    status: "Pending",
  },

  {
    id: "TL002",
    studentName: "Sneha Reddy",
    rollNumber: "23CSE018",
    section: "CSE-B",
    type: "OD",
    fromDate: "05 October 2026",
    toDate: "06 October 2026",
    reason: "Technical competition",
    status: "Pending",
  },

  {
    id: "TL003",
    studentName: "Arjun Rao",
    rollNumber: "23CSE025",
    section: "CSE-A",
    type: "Medical Leave",
    fromDate: "20 September 2026",
    toDate: "21 September 2026",
    reason: "Health appointment",
    status: "Approved",
  },
];


// ============================================================
// STUDENT DIRECTORY
// ============================================================

export const studentDirectory = [
  {
    id: "STU001",
    name: "Thanusha Reddy",
    rollNumber: "23CSE001",
    branch: "CSE",
    section: "B",
    year: 3,
    email: "thanusha.reddy@example.com",
  },

  {
    id: "STU002",
    name: "Rahul Kumar",
    rollNumber: "23CSE012",
    branch: "CSE",
    section: "B",
    year: 3,
    email: "rahul.kumar@example.com",
  },

  {
    id: "STU003",
    name: "Sneha Reddy",
    rollNumber: "23CSE018",
    branch: "CSE",
    section: "B",
    year: 3,
    email: "sneha.reddy@example.com",
  },

  {
    id: "STU004",
    name: "Arjun Rao",
    rollNumber: "23CSE025",
    branch: "CSE",
    section: "A",
    year: 3,
    email: "arjun.rao@example.com",
  },
];


// ============================================================
// CAMPUS INFORMATION
// ============================================================

export const campusInfo = {
  campusName: "Ask Campiko Campus",

  status: "Operating Normally",

  alert:
    "No major campus alerts right now.",

  lastUpdated:
    "Updated just now",

  emergencyContact:
    "+91 1800 000 000",

  locations: [
    {
      name: "Main Block",
      type: "Academic Building",
    },

    {
      name: "Central Library",
      type: "Library",
    },

    {
      name: "Innovation Lab",
      type: "Laboratory",
    },

    {
      name: "Main Auditorium",
      type: "Auditorium",
    },

    {
      name: "Cafeteria",
      type: "Food Court",
    },
  ],
};