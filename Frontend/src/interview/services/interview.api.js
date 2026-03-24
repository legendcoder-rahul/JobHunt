import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://jobhunt-1-fkck.onrender.com"

const api = axios.create({
    baseURL: BACKEND_URL,
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

    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await api.post("/api/v1/interview/", formData, { headers })
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
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.get(`/api/v1/interview/report/${interviewId}`, { headers })

    return response.data
}

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.get("/api/v1/interview/", { headers })

    return response.data
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await api.post(`/api/v1/interview/resume/pdf/${interviewReportId}`, null, {
        headers,
        responseType: "blob"
    })

    return response.data
}