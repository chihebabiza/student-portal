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
    try {
        res.render('login', {
            title: 'Login - UniPortal',
            error: req.query.error
        });
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.status(500).render('error', { message: 'Failed to load login page' });
    }
});

/**
 * @desc    Authenticate user and set token cookie
 * @route   POST /login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.redirect('/login?error=Please+enter+email+and+password');
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.redirect('/login?error=Invalid+email+or+password');
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });

        return user.role === 'admin'
            ? res.redirect('/admin/dashboard?success=Logged+in+successfully')
            : res.redirect('/student/dashboard?success=Logged+in+successfully');
    } catch (error) {
        console.error('Error logging in user:', error);
        res.redirect('/login?error=Something+went+wrong');
    }
});

/**
 * @desc    Logout user (clear token cookie)
 * @route   GET /logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.redirect('/?success=Logged+out+successfully');
    } catch (error) {
        console.error('Error logging out user:', error);
        res.redirect('/?error=Failed+to+logout');
    }
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