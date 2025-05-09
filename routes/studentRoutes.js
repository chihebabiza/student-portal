const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboard,
} = require('../controllers/studentController');
const {
  addProjectToWishlist,
  getWishlist,
  removeProjectFromWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');

// =============== Admin routes ===============

// @route   GET /admin/students
router.get('/admin/students', protect, checkRole('admin'), getStudents);

// @route   POST /admin/students
router.post('/admin/students', protect, checkRole('admin'), createStudent);

// @route   PUT /admin/students/:id
router.put('/admin/students/:id', protect, checkRole('admin'), updateStudent);

// @route   DELETE /admin/students/:id
router.delete('/admin/students/:id', protect, checkRole('admin'), deleteStudent);

// =============== Student routes ===============

// @route   GET /student/dashboard
router.get('/student/dashboard', protect, checkRole('student'), getDashboard);

// @route   GET /student/wishlist
router.get('/student/wishlist', protect, checkRole('student'), getWishlist);

// @route   POST /api/wishlists
router.post('/api/wishlists', protect, checkRole('student'), addProjectToWishlist);

// @route   DELETE /student/wishlist/remove/:projectId
router.delete('/student/wishlist/remove/:projectId', protect, checkRole('student'), removeProjectFromWishlist);

// @route   DELETE /student/wishlist/clear
router.delete('/student/wishlist/clear', protect, checkRole('student'), clearWishlist);

module.exports = router;