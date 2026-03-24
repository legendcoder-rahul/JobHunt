const express = require('express')
const { register,login, updateProfile,logout, googleLogin } = require('../controllers/user.controller.js')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const { imageUpload } = require('../middlewares/imageUpload.middleware.js')
const { resumeUpload } = require('../middlewares/resumeUpload.middleware.js')
const passport = require('passport')

const router = express.Router()

router.route('/register').post(imageUpload.single('file'), register)
router.route('/login').post(login)
router.route('/logout').get(isAuthenticated, logout)
router.route('/profile/update').post(
    isAuthenticated, 
    imageUpload.single('profilePhoto'), 
    resumeUpload.single('resume'),
    updateProfile
)

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleLogin
);

// Google token verification route for frontend
router.post('/auth/google/verify', googleLogin);

module.exports = router