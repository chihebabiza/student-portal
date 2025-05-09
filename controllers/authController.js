const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * @desc    Render login page
 * @route   GET /login
 * @access  Public
 */
const getLogin = asyncHandler(async (req, res) => {
    res.render('login', {
        title: 'Login - UniPortal',
        error: req.query.error
    });
});

/**
 * @desc    Authenticate user and set token cookie
 * @route   POST /login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Redirect based on role
        return user.role === 'admin'
            ? res.redirect('/admin/dashboard')
            : res.redirect('/student/dashboard');
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

/**
 * @desc    Logout user (clear token cookie)
 * @route   GET /logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.redirect('/');
});

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = {
    getLogin,
    loginUser,
    logoutUser
};