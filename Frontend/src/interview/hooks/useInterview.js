import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../Interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (response?.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            }
            return null
        } catch (error) {
            console.log(error)
            const backendMessage = error?.response?.data?.message || "Report generation failed"
            console.log(backendMessage)
            throw new Error(backendMessage)
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            console.log('Fetching report for ID:', interviewId)
            response = await getInterviewReportById(interviewId)
            
            console.log('Full API Response:', response)
            console.log('Interview Report data:', response?.interviewReport)
            
            if (response?.interviewReport) {
                console.log('Setting report in context:', response.interviewReport)
                setReport(response.interviewReport)
                return response.interviewReport
            } else {
                console.warn('No interviewReport in response')
            }
        } catch (error) {
            console.error('Error fetching report:', error)
            console.error('Error message:', error?.message)
            console.error('Error response:', error?.response?.data)
        } finally {
            setLoading(false)
        }
        return null
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response?.interviewReports || [])
        } catch (error) {
            console.log(error)
            setReports([])
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

 useEffect(() => {
    // 1. Exit if already loading to prevent overlapping requests
    if (loading) return;

    if (interviewId) {
        // 2. Only fetch specific report if we don't have it
        if (!report || report._id !== interviewId) {
            getReportById(interviewId);
        }
    } else {
        // 3. Only fetch list if the list is currently empty
        if (reports.length === 0) {
            getReports();
        }
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [interviewId]); // Remove 'loading' or 'reports' from dependencies
    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }

}
