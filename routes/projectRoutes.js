const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const { createProject, updateProject, deleteProject } = require('../controllers/projectController');


// Protected admin routes
router.post('/admin/projects', protect, checkRole('admin'), createProject);
router.post('/admin/projects/:id', protect, checkRole('admin'), updateProject);
router.get('/admin/projects/delete/:id', protect, checkRole('admin'), deleteProject);

module.exports = router;