const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student','recruiter'],
        required: true
    },
    profile: {
        bio: {type: String},
        skills: {type: String},
        resume: {type: String},
        resumeOriginalName: {type: String},
        company: {type: mongoose.Schema.Types.ObjectId, ref: 'company'},
        profilePhoto: {
            type: String,
            default: 'https://ik.imagekit.io/rgd5xllk8/default-avatar.png'
        }
    }   
},{timestamps: true})

const UserModel = mongoose.model('user', userSchema)

module.exports = { UserModel }