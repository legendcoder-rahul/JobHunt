const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `You are an expert interview preparation coach. Generate a comprehensive interview report for a candidate applying for a job.

CANDIDATE INFORMATION:
Resume: ${resume}

Self Description: ${selfDescription}

JOB DESCRIPTION:
${jobDescription}

IMPORTANT: Return a valid JSON object with EXACTLY this structure (no extra fields, no strings outside the object):
{
  "title": "Job Role Title (extract from job description)",
  "matchScore": <number between 0-100>,
  "technicalQuestions": [
    {
      "question": "question text",
      "intention": "why this question",
      "answer": "how to answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "question text",
      "intention": "why this question",
      "answer": "how to answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "skill name",
      "severity": "low|medium|high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "focus area",
      "tasks": ["task1", "task2"]
    }
  ]
}

Requirements:
- technicalQuestions: array of 5+ objects
- behavioralQuestions: array of 3+ objects
- skillGaps: array of skills lacking
- preparationPlan: array of 7 day objects
- matchScore: number 0-100`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    })

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text
    console.log("Raw AI Response:", responseText);
    
    try {
        const parsed = JSON.parse(responseText);
        return parsed;
    } catch (e) {
        console.error("Failed to parse AI response:", e);
        throw new Error("AI response is not valid JSON");
    }
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a professional tailored resume in HTML format for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

Return ONLY valid JSON with this exact structure:
{
  "html": "<html>...</html>"
}

Requirements for HTML:
- The resume should be tailored for the given job description
- Highlight the candidate's strengths and relevant experience
- Well-formatted and structured HTML
- Professional and simple design
- ATS friendly (easily parsable)
- Should be 1-2 pages long when converted to PDF
- Include all relevant information
- Not sound like AI-generated content`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    })

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || response.text
    console.log("Raw Resume PDF Response:", responseText);
    
    try {
        const jsonContent = JSON.parse(responseText)
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
        return pdfBuffer
    } catch (e) {
        console.error("Failed to parse resume PDF response:", e);
        throw new Error("Failed to generate resume PDF");
    }

}

module.exports = { generateInterviewReport, generateResumePdf }