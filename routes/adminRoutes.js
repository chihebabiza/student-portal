const express = require('express');
const { adminDashboard, adminAnnouncements, adminProjects, adminStudents, adminWishlist, viewStudentWishlist } = require('../controllers/adminController');
const { protect, checkRole } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/dashboard', protect, checkRole('admin'), adminDashboard);
router.get('/announcements', protect, checkRole('admin'), adminAnnouncements);
router.get('/projects', protect, checkRole('admin'), adminProjects);
router.get('/students', protect, checkRole('admin'), adminStudents);
router.get('/wishlist/:id', protect, checkRole('admin'), viewStudentWishlist);

module.exports = router;