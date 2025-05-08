const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect routes - redirect to login if not authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/login');
  }
});

// Check user role
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page'
      });
    }
    next();
  };
};

module.exports = { protect, checkRole };