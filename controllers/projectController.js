const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get all projects (Reusable function)
 * @access  Public
 */
const getProjects = async (filter = {}) => {
    return await Project.find(filter).sort('-createdAt');
};

/**
 * @desc    Create new project
 * @route   POST /admin/projects
 * @access  Private/Admin
 */
const createProject = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.redirect('/admin/projects?error=Please+include+all+fields');
        }

        await Project.create({ title, description });
        res.redirect('/admin/projects?success=Project+created+successfully');
    } catch (error) {
        console.error('Error creating project:', error);
        res.redirect('/admin/projects?error=Failed+to+create+project');
    }
});

/**
 * @desc    Update project
 * @route   POST /admin/projects/:id
 * @access  Private/Admin
 */
const updateProject = asyncHandler(async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.redirect('/admin/projects?error=Project+not+found');
        }

        const { title, description } = req.body;
        if (!title || !description) {
            return res.redirect(`/admin/projects?error=Please+include+all+fields`);
        }

        await Project.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
        res.redirect('/admin/projects?success=Project+updated+successfully');
    } catch (error) {
        console.error('Error updating project:', error);
        res.redirect('/admin/projects?error=Failed+to+update+project');
    }
});

/**
 * @desc    Delete project
 * @route   GET /admin/projects/delete/:id
 * @access  Private/Admin
 */
const deleteProject = asyncHandler(async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.redirect('/admin/projects?error=Project+not+found');
        }

        await project.remove();
        res.redirect('/admin/projects?success=Project+deleted+successfully');
    } catch (error) {
        console.error('Error deleting project:', error);
        res.redirect('/admin/projects?error=Failed+to+delete+project');
    }
});

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};