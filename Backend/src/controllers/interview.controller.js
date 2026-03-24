const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service.js")
const interviewReportModel = require("../models/interviewReport.model.js")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        console.log("Request received - Body:", req.body);
        console.log("Request file:", req.file ? "File exists" : "No file");
        console.log("Request ID:", req.id);

        if (!req.id) {
            return res.status(401).json({
                message: "Unauthorized: User not authenticated."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required. Make sure to upload a file with field name 'resume'.",
                debug: { hasFile: !!req.file, body: req.body }
            });
        }

        const { selfDescription, jobDescription } = req.body

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                message: "selfDescription and jobDescription are required."
            });
        }
        
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

        console.log("Generating interview report from AI...");
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })

        console.log("AI response:", interViewReportByAi);

        // Extract job title from jobDescription if not provided by AI
        // Usually the first line is the job title
        let jobTitle = interViewReportByAi.title || jobDescription.split('\n')[0] || 'Interview Report';

        // Parse fields if they are strings
        let technicalQuestions = interViewReportByAi.technicalQuestions || [];
        let behavioralQuestions = interViewReportByAi.behavioralQuestions || [];
        let skillGaps = interViewReportByAi.skillGaps || [];
        let preparationPlan = interViewReportByAi.preparationPlan || [];

        // Convert string arrays to actual arrays if needed
        if (typeof technicalQuestions === 'string') {
            try {
                technicalQuestions = JSON.parse(technicalQuestions);
            } catch (e) {
                technicalQuestions = [];
            }
        }
        if (typeof behavioralQuestions === 'string') {
            try {
                behavioralQuestions = JSON.parse(behavioralQuestions);
            } catch (e) {
                behavioralQuestions = [];
            }
        }
        if (typeof skillGaps === 'string') {
            try {
                skillGaps = JSON.parse(skillGaps);
            } catch (e) {
                skillGaps = [];
            }
        }
        if (typeof preparationPlan === 'string') {
            try {
                preparationPlan = JSON.parse(preparationPlan);
            } catch (e) {
                preparationPlan = [];
            }
        }

        const interviewReport = await interviewReportModel.create({
            user: req.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            matchScore: interViewReportByAi.matchScore || 0,
            technicalQuestions: Array.isArray(technicalQuestions) ? technicalQuestions : [],
            behavioralQuestions: Array.isArray(behavioralQuestions) ? behavioralQuestions : [],
            skillGaps: Array.isArray(skillGaps) ? skillGaps : [],
            preparationPlan: Array.isArray(preparationPlan) ? preparationPlan : [],
            title: jobTitle
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: error.message || "Error generating interview report",
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    if (!req.id) {
        return res.status(401).json({
            message: "Unauthorized: User not authenticated."
        });
    }

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    if (!req.id) {
        return res.status(401).json({
            message: "Unauthorized: User not authenticated."
        });
    }
    const interviewReports = await interviewReportModel.find({ user: req.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }