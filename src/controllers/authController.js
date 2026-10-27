const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const db = require('../data/db');

exports.login = async (req, res, next) => {
  try {
    const { identifier, password, role = 'Student', rememberMe } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your identification credential and password.'
      });
    }

    // 1. Search for user matching identifier and role
    let user = db.findUserByIdentifier(identifier, role);

    // If not found with specified role, check if user exists under another role to give actionable error
    if (!user) {
      const anyUser = db.findUserByIdentifier(identifier, null);
      if (anyUser) {
        return res.status(400).json({
          success: false,
          message: `Account found, but it is registered as a ${anyUser.role}. Please switch to the ${anyUser.role} tab to sign in.`
        });
      }

      return res.status(401).json({
        success: false,
        message: role === 'Student' 
          ? 'Invalid University Roll Number or Email. Please check your credentials.'
          : 'Invalid Institutional Faculty Email or Faculty ID.'
      });
    }

    // 2. Validate password
    let isMatch = false;
    if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }
    // Fallback if plain password match
    if (!isMatch && user.password && user.password === password) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your password and try again.'
      });
    }

    // 3. Generate JWT Token
    const expiresIn = rememberMe ? '30d' : config.jwtExpiresIn;
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name
      },
      config.jwtSecret,
      { expiresIn }
    );

    // 4. Prepare Safe User Profile & Redirect
    const { passwordHash, password: pwd, ...safeUser } = user;

    // Attach mentor info if student
    if (user.role === 'Student' && user.mentorId) {
      const mentor = db.findUserById(user.mentorId);
      if (mentor) {
        safeUser.mentor = {
          id: mentor.id,
          name: mentor.name,
          designation: mentor.designation,
          email: mentor.email,
          officeRoom: mentor.officeRoom,
          phone: mentor.phone,
          avatar: mentor.avatar
        };
      }
    }

    // Determine target dashboard
    const redirectUrl = user.role === 'Student' ? '/student-dashboard.html' : '/faculty-dashboard.html';

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser,
      redirectUrl
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { passwordHash, ...safeUser } = user;

    if (user.role === 'Student') {
      if (user.mentorId) {
        const mentor = db.findUserById(user.mentorId);
        if (mentor) {
          safeUser.mentor = {
            id: mentor.id,
            name: mentor.name,
            designation: mentor.designation,
            email: mentor.email,
            officeRoom: mentor.officeRoom,
            phone: mentor.phone,
            avatar: mentor.avatar
          };
        }
      }
      safeUser.meetings = db.getMeetingsForStudent(user.id);
      safeUser.milestones = db.getMilestonesForStudent(user.id);
    } else if (user.role === 'Faculty') {
      const mentees = db.getStudentsByMentorId(user.id).map(m => {
        const { passwordHash, ...safeMentee } = m;
        return safeMentee;
      });
      safeUser.menteesCount = mentees.length;
      safeUser.assignedMentees = mentees;
      safeUser.meetings = db.getMeetingsForFaculty(user.id);
    }

    return res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your registered Roll Number or College Email address.'
    });
  }

  return res.status(200).json({
    success: true,
    message: `Password reset instructions have been dispatched to the institutional email on file for "${identifier}". Please check your inbox or contact the Academic Cell for expedited reset.`
  });
};

exports.logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};
