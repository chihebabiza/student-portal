const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { getProjects } = require('../controllers/projectController');
const { addProjectToWishlist, getWishlist, removeProjectFromWishlist, clearWishlist } = require('../controllers/wishlistController');


// Protected admin routes
router.post('/admin/students', protect, checkRole('admin'), createStudent);
router.post('/admin/students/:id', protect, checkRole('admin'), updateStudent);
router.get('/admin/students/delete/:id', protect, checkRole('admin'), deleteStudent);
router.post('/api/wishlists', protect, checkRole('student'), addProjectToWishlist);
router.delete('/student/wishlist/remove/:projectId', protect, checkRole('student'), removeProjectFromWishlist);
router.delete('/student/wishlist/clear', protect, checkRole('student'), clearWishlist);

router.get('/student/dashboard', protect, checkRole('student'), async (req, res) => {
  try {
    const projects = await getProjects();
    res.render('student/studentProjects', {
      title: 'Student Projects',
      projects,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Failed to load announcements' });
  }
});

router.get('/student/wishlist', protect, checkRole('student'), getWishlist);

module.exports = router;