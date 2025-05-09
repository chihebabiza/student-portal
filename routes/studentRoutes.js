const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { createStudent, updateStudent, deleteStudent, getDashboard } = require('../controllers/studentController');
const { addProjectToWishlist, getWishlist, removeProjectFromWishlist, clearWishlist } = require('../controllers/wishlistController');


// Protected admin routes
router.post('/admin/students', protect, checkRole('admin'), createStudent);
router.post('/admin/students/:id', protect, checkRole('admin'), updateStudent);
router.get('/admin/students/delete/:id', protect, checkRole('admin'), deleteStudent);
router.post('/api/wishlists', protect, checkRole('student'), addProjectToWishlist);
router.delete('/student/wishlist/remove/:projectId', protect, checkRole('student'), removeProjectFromWishlist);
router.delete('/student/wishlist/clear', protect, checkRole('student'), clearWishlist);

router.get('/student/dashboard', protect, checkRole('student'), getDashboard);

router.get('/student/wishlist', protect, checkRole('student'), getWishlist);

module.exports = router;