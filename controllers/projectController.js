const Project = require('../models/projectModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all projects (Reusable function)
// @access  Public
const getProjects = async (filter = {}) => {
    return await Project.find(filter).sort('-createdAt');
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const project = await Project.create({
        title,
        description,
    });

    res.redirect('/admin/dashboard');
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.redirect('/admin/dashboard');
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    await project.remove();
    res.redirect('/admin/dashboard');
});

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
};