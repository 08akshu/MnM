const db = require('../data/db');

exports.getProfile = (req, res, next) => {
  try {
    const faculty = db.findUserById(req.user.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty record not found.' });
    }

    const { passwordHash, ...safeFaculty } = faculty;
    const mentees = db.getStudentsByMentorId(faculty.id);
    const meetings = db.getMeetingsForFaculty(faculty.id);

    return res.status(200).json({
      success: true,
      data: {
        ...safeFaculty,
        totalMentees: mentees.length,
        totalMeetings: meetings.length
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMentees = (req, res, next) => {
  try {
    const mentees = db.getStudentsByMentorId(req.user.id).map(m => {
      const { passwordHash, ...safe } = m;
      const isAtRisk = (safe.attendance < 75) || (safe.cgpa < 7.0);
      return {
        ...safe,
        isAtRisk,
        riskReason: safe.attendance < 75 ? 'Low Attendance (<75%)' : (safe.cgpa < 7.0 ? 'Low CGPA (<7.0)' : 'Good Standing')
      };
    });

    return res.status(200).json({
      success: true,
      count: mentees.length,
      data: mentees
    });
  } catch (err) {
    next(err);
  }
};

exports.getMenteeDetails = (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = db.findUserById(studentId);

    if (!student || student.role !== 'Student' || student.mentorId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Mentee not found or not assigned to your mentorship cohort.'
      });
    }

    const { passwordHash, ...safeStudent } = student;
    const meetings = db.getMeetingsForStudent(student.id);
    const milestones = db.getMilestonesForStudent(student.id);

    return res.status(200).json({
      success: true,
      data: {
        ...safeStudent,
        meetings,
        milestones
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logMeeting = (req, res, next) => {
  try {
    const { studentId, title, scheduledDate, scheduledTime, mode, agenda, notes, actionItems, status } = req.body;

    if (!studentId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Student ID and meeting title are required.'
      });
    }

    const meeting = db.createMeeting({
      studentId,
      facultyId: req.user.id,
      title,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime || '12:00 PM',
      mode: mode || 'In-Person (Room 402)',
      agenda: agenda || 'Mentorship review session',
      notes: notes || '',
      actionItems: Array.isArray(actionItems) ? actionItems : (actionItems ? [actionItems] : []),
      status: status || 'Completed',
      requestedBy: 'Faculty'
    });

    return res.status(201).json({
      success: true,
      message: 'Mentorship meeting record logged successfully.',
      data: meeting
    });
  } catch (err) {
    next(err);
  }
};

exports.getStats = (req, res, next) => {
  try {
    const mentees = db.getStudentsByMentorId(req.user.id);
    const meetings = db.getMeetingsForFaculty(req.user.id);

    const totalMentees = mentees.length;
    const atRiskCount = mentees.filter(m => (m.attendance < 75) || (m.cgpa < 7.0)).length;
    
    const avgAttendance = totalMentees > 0 
      ? (mentees.reduce((acc, m) => acc + (m.attendance || 0), 0) / totalMentees).toFixed(1)
      : 0;

    const avgCgpa = totalMentees > 0
      ? (mentees.reduce((acc, m) => acc + (m.cgpa || 0), 0) / totalMentees).toFixed(2)
      : 0;

    const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled').length;
    const completedMeetings = meetings.filter(m => m.status === 'Completed').length;

    return res.status(200).json({
      success: true,
      data: {
        totalMentees,
        atRiskCount,
        avgAttendance: Number(avgAttendance),
        avgCgpa: Number(avgCgpa),
        upcomingMeetings,
        completedMeetings
      }
    });
  } catch (err) {
    next(err);
  }
};
