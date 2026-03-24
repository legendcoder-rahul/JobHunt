const express = require('express')
const isAuthenticated = require('../middlewares/isAuthenticated.js')
const { applyJob, getAppliedJobs, getApplicants, updateStatus } = require('../controllers/application.controller.js')
const router = express.Router()

router.route('/apply/:id').post(isAuthenticated, applyJob)
router.route('/get').get(isAuthenticated, getAppliedJobs)
router.route('/:id/applicants').get(isAuthenticated, getApplicants)
router.route('/status/:id/update').put(isAuthenticated, updateStatus)


module.exports = router