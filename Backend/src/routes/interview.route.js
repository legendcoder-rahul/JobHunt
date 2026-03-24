const express = require("express")
const isAuthenticated = require("../middlewares/isAuthenticated.js")
const {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
} = require("../controllers/interview.controller.js")
const upload = require("../middlewares/multer.middleware.js")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.route("/").post(isAuthenticated, (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || "File upload error" });
        }
        next();
    });
}, generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.route("/report/:interviewId").get(isAuthenticated, getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.route("/").get(isAuthenticated, getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.route("/resume/pdf/:interviewReportId").post(isAuthenticated, generateResumePdfController)


module.exports = interviewRouter