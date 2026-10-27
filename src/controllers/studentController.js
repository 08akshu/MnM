const db = require('../data/db');

exports.getProfile = (req, res, next) => {
  try {
    const student = db.findUserById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const { passwordHash, ...safeStudent } = student;
    const mentor = student.mentorId ? db.findUserById(student.mentorId) : null;
    let safeMentor = null;
    if (mentor) {
      const { passwordHash: _, ...m } = mentor;
      safeMentor = m;
    }

    return res.status(200).json({
      success: true,
      data: {
        ...safeStudent,
        mentor: safeMentor
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMeetings = (req, res, next) => {
  try {
    const meetings = db.getMeetingsForStudent(req.user.id);
    return res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (err) {
    next(err);
  }
};

exports.requestMeeting = (req, res, next) => {
  try {
    const { title, scheduledDate, scheduledTime, mode, agenda } = req.body;

    if (!title || !scheduledDate || !scheduledTime || !agenda) {
      return res.status(400).json({
        success: false,
        message: 'Missing required meeting details (title, scheduledDate, scheduledTime, agenda).'
      });
    }

    const student = db.findUserById(req.user.id);
    if (!student.mentorId) {
      return res.status(400).json({
        success: false,
        message: 'No mentor is currently assigned to this student account.'
      });
    }

    const newMeeting = db.createMeeting({
      studentId: req.user.id,
      facultyId: student.mentorId,
      title,
      scheduledDate,
      scheduledTime,
      mode: mode || 'In-Person (Mentor Office)',
      agenda,
      status: 'Scheduled',
      requestedBy: 'Student'
    });

    return res.status(201).json({
      success: true,
      message: 'Mentorship meeting requested successfully.',
      data: newMeeting
    });
  } catch (err) {
    next(err);
  }
};

exports.getMilestones = (req, res, next) => {
  try {
    const milestones = db.getMilestonesForStudent(req.user.id);
    return res.status(200).json({
      success: true,
      data: milestones
    });
  } catch (err) {
    next(err);
  }
};

exports.createMilestone = (req, res, next) => {
  try {
    const { title, deadline, category } = req.body;
    if (!title || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title and target deadline are required for academic milestones.'
      });
    }

    const milestone = db.createMilestone({
      studentId: req.user.id,
      title,
      deadline,
      category: category || 'Academic',
      progress: 0,
      status: 'In Progress'
    });

    return res.status(201).json({
      success: true,
      message: 'Milestone created successfully.',
      data: milestone
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMilestone = (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, status } = req.body;

    const updated = db.updateMilestone(id, {
      ...(progress !== undefined ? { progress: Number(progress) } : {}),
      ...(status ? { status } : {})
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Milestone updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
