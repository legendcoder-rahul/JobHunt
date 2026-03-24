const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const { postJob, getAllJobs, getJobById, getAdminJObs } = require('../controllers/post.controller.js')

const router = express.Router()

router.route('/post').post(isAuthenticated, postJob)
router.route('/get').get(getAllJobs)
router.route('/get/:id').get(getJobById)
router.route('/getadminjobs').get(isAuthenticated, getAdminJObs)

module.exports = router