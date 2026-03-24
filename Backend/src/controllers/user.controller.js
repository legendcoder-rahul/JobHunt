const { UserModel } = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")

const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: 'Something is missing',
                success: false
            })
        }

        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false
            })
        }

        const hash = await bcrypt.hash(password, 10)

        // Upload to ImageKit using SDK
        let profilePhotoUrl = 'https://ik.imagekit.io/rgd5xllk8/default-avatar.png'
        
        if (req.file) {
            try {
                const imagekit = new ImageKit({
                    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
                })

                const file = await imagekit.files.upload({
                    file: await toFile(Buffer.from(req.file.buffer), 'file'),
                    fileName: `profile_${email}_${Date.now()}`,
                    folder: 'JobHunter/ProfilePhotos'
                })

                profilePhotoUrl = file.url
                console.log('✅ Profile photo uploaded:', profilePhotoUrl)
            } catch (uploadError) {
                console.error('❌ ImageKit upload failed:', uploadError.message)
                // Continue with default image
            }
        }

        const newUser = await UserModel.create({
            fullname,
            email,
            phoneNumber,
            password: hash,
            role,
            profile: {
                profilePhoto: profilePhotoUrl
            }
        })

        const tokenData = {
            userId: newUser._id
        }
        const jwtToken = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                profile: newUser.profile
            },
            token: jwtToken,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error during registration',
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({
                message: 'Something is missing',
                success: false
            })
        }
        let user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: 'Incorrect email or password',
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect email or password.',
                success: false
            })
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        }


        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        if (!user.profile) {
            user.profile = {};
        }
        if (!user.profile.profilePhoto) {
            user.profile.profilePhoto = 'https://ik.imagekit.io/rgd5xllk8/default-avatar.png';
        }
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'lax', secure: true }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            token,
            success: true
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error during login',
            success: false
        })
    }
}

const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', { maxAge: 0, httpsOnly: true, sameSite: 'lax', secure: true }).json({
            message: 'Logged out successfully',
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error during logout',
            success: false
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(',')
        }
        const userId = req.id
        let user = await UserModel.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: 'User not found.',
                success: false
            })
        }

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        // Upload profile photo if provided
        if (req.file && req.file.fieldname === 'profilePhoto') {
            try {
                const imagekit = new ImageKit({
                    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
                    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
                })

                const file = await imagekit.files.upload({
                    file: await toFile(Buffer.from(req.file.buffer), 'file'),
                    fileName: `profile_${email || user.email}_${Date.now()}`,
                    folder: 'JobHunter/ProfilePhotos'
                })

                user.profile.profilePhoto = file.url
                console.log('✅ Profile photo updated:', file.url)
            } catch (uploadError) {
                console.error('❌ Profile photo upload failed:', uploadError.message)
            }
        }

        //updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray
        if (req.uploadedResumeUrl) {
            user.profile.resume = req.uploadedResumeUrl
            user.profile.resumeOriginalName = req.resumeOriginalName
        }

        await user.save()

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: 'Profile updated successfully.',
            user,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error updating profile',
            success: false
        })
    }
}

const googleLogin = async (req, res) => {
    try {
        // When coming from passport callback
        if (req.user) {
            const tokenData = {
                userId: req.user._id
            };

            const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

            const userData = {
                _id: req.user._id,
                fullname: req.user.fullname,
                email: req.user.email,
                phoneNumber: req.user.phoneNumber,
                role: req.user.role,
                profile: req.user.profile
            };

            return res.status(200).json({
                message: `Welcome ${req.user.fullname}`,
                user: userData,
                token,
                success: true
            });
        }

        // When coming from frontend with Google token
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({
                message: 'Token is required',
                success: false
            });
        }

        // Verify token
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Find or create user
        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.create({
                fullname: name,
                email,
                phoneNumber: 0,
                password: 'google-oauth',
                role: 'student',
                profile: {
                    profilePhoto: picture
                }
            });
        }

        const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: `Welcome ${user.fullname}`,
            user: userData,
            token: jwtToken,
            success: true
        });
    } catch (error) {
        console.log('Google login error:', error);
        return res.status(500).json({
            message: 'Google login failed',
            success: false
        });
    }
}

module.exports = { register, login, logout, updateProfile, googleLogin }