const db = require('../data/db');

exports.getMeetingById = (req, res, next) => {
  try {
    const { id } = req.params;
    const data = db.load();
    const meeting = data.meetings.find(m => m.id === id);

    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }

    // Access control: only the student or the faculty involved can view it
    if (req.user.role === 'Student' && meeting.studentId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access forbidden.' });
    }
    if (req.user.role === 'Faculty' && meeting.facultyId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access forbidden.' });
    }

    const student = db.findUserById(meeting.studentId);
    const faculty = db.findUserById(meeting.facultyId);

    return res.status(200).json({
      success: true,
      data: {
        ...meeting,
        studentName: student ? student.name : 'Unknown Student',
        studentRollNo: student ? student.rollNo : '',
        facultyName: faculty ? faculty.name : 'Unknown Faculty'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMeeting = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, actionItems, scheduledDate, scheduledTime } = req.body;

    const existing = db.load().meetings.find(m => m.id === id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Meeting not found.' });
    }

    // Faculty or assigned student can update
    const isMentor = req.user.role === 'Faculty' && existing.facultyId === req.user.id;
    const isStudent = req.user.role === 'Student' && existing.studentId === req.user.id;

    if (!isMentor && !isStudent) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this meeting.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined && isMentor) updates.notes = notes;
    if (actionItems !== undefined) updates.actionItems = Array.isArray(actionItems) ? actionItems : [actionItems];
    if (scheduledDate) updates.scheduledDate = scheduledDate;
    if (scheduledTime) updates.scheduledTime = scheduledTime;

    const updated = db.updateMeeting(id, updates);

    return res.status(200).json({
      success: true,
      message: 'Meeting updated successfully.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
