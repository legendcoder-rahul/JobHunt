import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
})

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }, retries = 3) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await api.post("/api/v1/interview/", formData)
            return response.data
        } catch (error) {
            if (error.response?.status === 429 && attempt < retries - 1) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, waitTime))
            } else {
                console.error("Error generating interview report:", error)
                throw error
            }
        }
    }
}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/v1/interview/report/${interviewId}`)

    return response.data
}

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/v1/interview/")

    return response.data
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/v1/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}