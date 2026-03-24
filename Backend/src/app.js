const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRoute = require('./routes/user.route.js')
const companyRoute = require('./routes/company.route.js')
const jobRoute = require('./routes/job.route.js')
const applicationRoute = require('./routes/application.route.js')
const interviewRoute = require('./routes/interview.route.js')
const passport = require('passport')
require('./config/passport.js') 

const app = express()

// CORS Configuration
const corsOptions = {
    origin: 'https://job-hunt-seven-weld.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

// Apply CORS first
app.use(cors(corsOptions))

// Body parsing middleware
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use('/api/v1/user',userRoute)
app.use('/api/v1/company',companyRoute)
app.use('/api/v1/job',jobRoute)
app.use('/api/v1/application',applicationRoute)
app.use('/api/v1/interview',interviewRoute)

module.exports = app