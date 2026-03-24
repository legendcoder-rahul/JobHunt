import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router-dom'

const ResumeAnalyzer = () => {
    const { loading, generateReport } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [error, setError] = useState("")
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setResumeFile(file)
            setError("") 
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleGenerate = async () => {
        setError("")
        if (!jobDescription.trim()) {
            setError("Job description is required.")
            return
        }
        if (!selfDescription.trim() && !resumeFile) {
            setError("Please upload a resume or provide a self description.")
            return
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            })
           
            if (data?._id) {
                // Show warning if demo report
                if (data.isDemoReport) {
                    toast.warning("⚠️ Using demo report - Upgrade for real AI analysis!");
                }
                navigate(`/interview/${data._id}`)
            } else {
                setError("Something went wrong. Please try again.")
            }

        } catch (err) {
            let errorMessage = "Failed to generate interview report. Please try again."
            
            // Handle different error types by status code
            if (err.response?.status === 429) {
                errorMessage = "⏱️ Rate limit hit. Please wait 2-5 minutes and try again."
            } else if (err.response?.status === 503) {
                errorMessage = "❌ API quota exhausted. Using demo reports now. Upgrade your plan for real analysis."
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.message?.includes('rate limit')) {
                errorMessage = "⏱️ Rate limit hit. Please wait a moment and try again."
            } else if (err.message?.includes('quota')) {
                errorMessage = "❌ API quota exceeded. Using demo reports. Upgrade for real analysis."
            } else if (err.message?.includes('API key')) {
                errorMessage = "❌ Invalid API key. Please check your configuration."
            } else if (err.message) {
                errorMessage = err.message.substring(0, 200)
            }
            
            setError(errorMessage)
        }
    }
    return (
        <div className="bg-background dark:bg-slate-950 font-body text-on-surface dark:text-slate-100 min-h-screen flex flex-col">

            <main className="flex-grow pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">

                <header className="text-center mb-16">
                    <h1 className="font-headline text-5xl md:text-6xl font-extrabold mb-4 dark:text-white">
                        Analyze Your <span className="text-[#6C5CE7]">Career Match</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto dark:text-gray-300">
                        Upload your profile and the target job description to receive an AI-powered gap analysis.
                    </p>
                    
                    <div className="mt-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded-lg inline-block">
                        ⚠️ <strong>Note:</strong> Trial reports are currently being used (API limit reached). Upgrade your plan for full AI analysis.
                    </div>
                </header>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded relative mb-6" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <section className="bg-surface-container-low dark:bg-slate-800 p-8 rounded-xl cloud-shadow shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">Target Job Description</h2>

                        <textarea
                            className="w-full h-96 p-4 rounded-xl bg-gray-50 dark:bg-slate-700 border dark:border-slate-600 dark:text-white outline-none resize-none"
                            placeholder="Paste job description..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </section>

                    <section className="space-y-8">

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <h2 className="text-2xl font-bold mb-4 dark:text-white">Your Profile</h2>

                            <div 
                                className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                onClick={handleUploadClick}
                            >
                                <p className="font-bold text-gray-700 dark:text-gray-300">{resumeFile ? resumeFile.name : "Upload Resume"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">PDF, DOCX</p>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    accept=".pdf,.docx,.doc"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <textarea
                                className="w-full h-40 mt-6 p-4 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 dark:text-white outline-none resize-none"
                                placeholder="Self Description (Optional if resume uploaded)..."
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                            />
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-8 rounded-xl text-center border dark:border-indigo-800">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">Ready to analyze?</p>

                            <button 
                                onClick={handleGenerate}
                                disabled={loading}
                                className={`w-full bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white py-4 rounded-full font-bold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? "Analyzing..." : "Run AI Gap Analysis"}
                            </button>
                        </div>

                    </section>
                </div>

                <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-bold mb-2 text-[#6C5CE7]">ATS Compatibility</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Check resume ATS compatibility.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-bold mb-2 text-[#6C5CE7]">Keyword Matching</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Find missing keywords.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <h3 className="font-bold mb-2 text-[#6C5CE7]">Smart Revisions</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get AI suggestions.</p>
                    </div>
                </section>

            </main>

        </div>
    );
};

export default ResumeAnalyzer;