const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'store.json');

// Default hashed password for 'academicPass@2025'
const DEFAULT_PASSWORD_HASH = '$2b$10$QLYXhUi8NLzvmHobGyXp2e5lqsC/yr4FWPJNxyhdjPn9Cpr8nzhUi';

const INITIAL_DATA = {
  users: [
    {
      id: "stu-1",
      rollNo: "1CR21CS042",
      email: "student@college.edu",
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: "Aarav Sharma",
      role: "Student",
      department: "Computer Science & Engineering",
      semester: 6,
      section: "A",
      cgpa: 8.64,
      attendance: 88.5,
      mentorId: "fac-1",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      phone: "+91 98765 43210",
      emergencyContact: "+91 98765 43211",
      createdAt: "2024-08-01T00:00:00Z"
    },
    {
      id: "stu-2",
      rollNo: "1CR21CS088",
      email: "priya.nair@college.edu",
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: "Priya Nair",
      role: "Student",
      department: "Computer Science & Engineering",
      semester: 6,
      section: "B",
      cgpa: 6.85,
      attendance: 72.0,
      mentorId: "fac-1",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
      phone: "+91 98765 11223",
      emergencyContact: "+91 98765 11224",
      createdAt: "2024-08-01T00:00:00Z"
    },
    {
      id: "stu-3",
      rollNo: "1CR21CS104",
      email: "rohit.verma@college.edu",
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: "Rohit Verma",
      role: "Student",
      department: "Computer Science & Engineering",
      semester: 6,
      section: "A",
      cgpa: 9.12,
      attendance: 94.0,
      mentorId: "fac-1",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      phone: "+91 98765 99887",
      emergencyContact: "+91 98765 99888",
      createdAt: "2024-08-01T00:00:00Z"
    },
    {
      id: "fac-1",
      facultyId: "FAC-CS-101",
      email: "dr.sharma@niet.edu",
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: "Dr. Rajesh Sharma",
      role: "Faculty",
      designation: "Associate Professor & Senior Mentor",
      department: "Computer Science & Engineering",
      officeRoom: "Tech Block 3, Room 402",
      phone: "+91 98112 33445",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      specializations: ["Artificial Intelligence", "Distributed Systems", "Career Guidance"],
      createdAt: "2023-01-15T00:00:00Z"
    }
  ],
  meetings: [
    {
      id: "meet-1",
      studentId: "stu-1",
      facultyId: "fac-1",
      title: "Semester 6 Academic & Capstone Project Review",
      scheduledDate: "2026-11-05",
      scheduledTime: "11:30 AM",
      mode: "In-Person (Room 402)",
      status: "Scheduled",
      agenda: "Review thesis proposal draft and progress in Cloud Computing lab.",
      notes: "",
      actionItems: [
        "Submit revised literature review",
        "Finalize team members for Capstone Phase 1"
      ],
      createdAt: "2026-10-20T10:00:00Z"
    },
    {
      id: "meet-2",
      studentId: "stu-1",
      facultyId: "fac-1",
      title: "Mid-Term Performance & Career Mentorship",
      scheduledDate: "2026-09-18",
      scheduledTime: "02:00 PM",
      mode: "In-Person (Room 402)",
      status: "Completed",
      agenda: "Assess Mid-Sem test scores, internship preparation, and elective course choices.",
      notes: "Student is performing well academically (CGPA 8.64). Advised to focus more on competitive coding and open-source contributions.",
      actionItems: [
        "Register for Summer Internship drive",
        "Enroll in Distributed Systems elective"
      ],
      createdAt: "2026-09-10T14:30:00Z"
    },
    {
      id: "meet-3",
      studentId: "stu-2",
      facultyId: "fac-1",
      title: "Attendance Warning & Remedial Support Plan",
      scheduledDate: "2026-10-15",
      scheduledTime: "03:30 PM",
      mode: "In-Person (Room 402)",
      status: "Completed",
      agenda: "Address low attendance (72%) in Theory of Computation and plan remedial classes.",
      notes: "Student was unwell during early September. Agreed on weekly attendance check-ins with mentor.",
      actionItems: [
        "Submit medical certificates to Academic Office",
        "Attend remedial lab tutorials on Fridays"
      ],
      createdAt: "2026-10-12T09:15:00Z"
    }
  ],
  milestones: [
    {
      id: "ms-1",
      studentId: "stu-1",
      title: "AWS Cloud Practitioner Certification",
      deadline: "2026-11-30",
      status: "In Progress",
      progress: 65,
      category: "Certification"
    },
    {
      id: "ms-2",
      studentId: "stu-1",
      title: "Submit Capstone Project Phase 1 Synopsis",
      deadline: "2026-11-15",
      status: "Completed",
      progress: 100,
      category: "Academic"
    },
    {
      id: "ms-3",
      studentId: "stu-1",
      title: "Maintain Semester Attendance > 85%",
      deadline: "2026-12-20",
      status: "In Progress",
      progress: 88,
      category: "Attendance"
    },
    {
      id: "ms-4",
      studentId: "stu-2",
      title: "Clear Remedial Classes in Theory of Computation",
      deadline: "2026-11-10",
      status: "In Progress",
      progress: 40,
      category: "Academic"
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: "Mentorship Review Window for Q3 is now Open",
      content: "All students are requested to complete the self-assessment before scheduling their Q3 review meeting.",
      date: "2026-10-25",
      priority: "High"
    },
    {
      id: "ann-2",
      title: "Pre-Placement Training & Mock Technical Interviews",
      content: "Departmental mock interviews will take place next week in Seminar Hall A.",
      date: "2026-10-28",
      priority: "Medium"
    }
  ]
};

// Database helper functions
class Database {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    if (!fs.existsSync(DB_FILE)) {
      this.save(INITIAL_DATA);
    }
  }

  load() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.save(INITIAL_DATA);
        return INITIAL_DATA;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading db.json, returning initial seed data:', err.message);
      return INITIAL_DATA;
    }
  }

  save(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err.message);
    }
  }

  // Users
  findUserByIdentifier(identifier, role) {
    const data = this.load();
    const cleanId = String(identifier).trim().toLowerCase();
    
    return data.users.find(u => {
      const matchRole = role ? u.role.toLowerCase() === role.toLowerCase() : true;
      if (!matchRole) return false;

      const emailMatch = u.email && u.email.toLowerCase() === cleanId;
      const rollMatch = u.rollNo && u.rollNo.toLowerCase() === cleanId;
      const facultyIdMatch = u.facultyId && u.facultyId.toLowerCase() === cleanId;

      return emailMatch || rollMatch || facultyIdMatch;
    });
  }

  findUserById(id) {
    const data = this.load();
    return data.users.find(u => u.id === id);
  }

  getStudentsByMentorId(mentorId) {
    const data = this.load();
    return data.users.filter(u => u.role === 'Student' && u.mentorId === mentorId);
  }

  // Meetings
  getMeetingsForStudent(studentId) {
    const data = this.load();
    return data.meetings.filter(m => m.studentId === studentId);
  }

  getMeetingsForFaculty(facultyId) {
    const data = this.load();
    return data.meetings.filter(m => m.facultyId === facultyId);
  }

  createMeeting(meetingData) {
    const data = this.load();
    const newMeeting = {
      id: `meet-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Scheduled',
      notes: '',
      actionItems: [],
      ...meetingData
    };
    data.meetings.unshift(newMeeting);
    this.save(data);
    return newMeeting;
  }

  updateMeeting(id, updates) {
    const data = this.load();
    const idx = data.meetings.findIndex(m => m.id === id);
    if (idx === -1) return null;
    data.meetings[idx] = { ...data.meetings[idx], ...updates };
    this.save(data);
    return data.meetings[idx];
  }

  // Milestones
  getMilestonesForStudent(studentId) {
    const data = this.load();
    return data.milestones.filter(m => m.studentId === studentId);
  }

  createMilestone(milestoneData) {
    const data = this.load();
    const newMilestone = {
      id: `ms-${Date.now()}`,
      progress: 0,
      status: 'In Progress',
      ...milestoneData
    };
    data.milestones.push(newMilestone);
    this.save(data);
    return newMilestone;
  }

  updateMilestone(id, updates) {
    const data = this.load();
    const idx = data.milestones.findIndex(m => m.id === id);
    if (idx === -1) return null;
    data.milestones[idx] = { ...data.milestones[idx], ...updates };
    this.save(data);
    return data.milestones[idx];
  }

  getAnnouncements() {
    const data = this.load();
    return data.announcements || [];
  }
}

module.exports = new Database();
