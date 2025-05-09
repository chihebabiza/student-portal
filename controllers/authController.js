const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate JWT token
        const token = generateToken(user._id);

        // Set the token in a cookie or session
        // In your loginUser controller
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict', // helps prevent CSRF
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Redirect based on role
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/student/dashboard');
        }
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    // Clear the token cookie
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // Immediately expire the cookie
    });

    res.redirect('/');
});

const getLogin = asyncHandler(async (req, res) => {
    res.render('login', {
        title: 'Login - UniPortal',
        error: req.query.error
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    loginUser,
    logoutUser,
    getLogin,
};