const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies or authorization header
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // Redirect to login if no token found
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.redirect('/login');
    }

    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/login');
  }
});

const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect('/login');
    }

    if (req.user.role === role) {
      next();
    } else {
      // Redirect to login or show access denied page
      return res.redirect('/login');
      // Alternative: return res.status(403).render('access-denied');
    }
  };
};

module.exports = { protect, checkRole };