import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'

const Interview = () => {
    const [expandedQIndex, setExpandedQIndex] = useState(null)
    const [expandedBhIndex, setExpandedBhIndex] = useState(null)
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6C5CE7] mx-auto mb-4"></div>
                    <h1 className="text-xl font-bold text-gray-700 dark:text-gray-300">Analyzing your profile...</h1>
                </div>
            </div>
        )
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">⚠️ Report not found</h1>
                    <p className="text-gray-500 dark:text-gray-400">Please try generating a new report.</p>
                </div>
            </div>
        )
    }

    const matchScore = report.matchScore || 0
    const technicalQuestions = report.technicalQuestions || []
    const behavioralQuestions = report.behavioralQuestions || []
    const skillGaps = report.skillGaps || []
    const preparationPlan = report.preparationPlan || []

    const getMatchStatus = (score) => {
        if (score >= 80) return 'STRONG FIT'
        if (score >= 60) return 'MODERATE FIT'
        return 'NEEDS IMPROVEMENT'
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'text-red-600 dark:text-red-400'
            case 'medium':
                return 'text-orange-600 dark:text-orange-400'
            case 'low':
                return 'text-blue-600 dark:text-blue-400'
            default:
                return 'text-gray-600'
        }
    }

    const getSeverityBgColor = (severity) => {
        switch (severity) {
            case 'high':
                return 'bg-red-100 dark:bg-red-900/30'
            case 'medium':
                return 'bg-orange-100 dark:bg-orange-900/30'
            case 'low':
                return 'bg-blue-100 dark:bg-blue-900/30'
            default:
                return 'bg-gray-100'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Analysis <span className="text-[#6C5CE7]">Results</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        We've benchmarked your profile against current industry standards for{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{report.title}</span> roles.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    
                    {/* Left Column - Match Score & Skill Gaps */}
                    <div className="lg:col-span-1 space-y-8">
                        
                        {/* Match Score Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Match Score</h2>
                            <div className="flex flex-col items-center">
                                {/* Circular Progress */}
                                <div className="relative w-40 h-40 mb-6">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                        {/* Background circle */}
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-slate-700" />
                                        {/* Progress circle */}
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            fill="none"
                                            stroke="#6C5CE7"
                                            strokeWidth="8"
                                            strokeDasharray={`${(matchScore / 100) * 314} 314`}
                                            strokeLinecap="round"
                                            className="transition-all duration-500"
                                        />
                                    </svg>
                                    {/* Center Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{matchScore}</span>
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">MATCH %</span>
                                    </div>
                                </div>
                                <p className="text-center font-semibold text-[#6C5CE7] text-lg">{getMatchStatus(matchScore)}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
                                    Your experience is {matchScore >= 80 ? 'excellent and directly' : matchScore >= 60 ? 'good but can be' : 'not fully'} aligned with this role.
                                </p>
                            </div>
                        </div>

                        {/* Skill Gaps Card */}
                        {skillGaps.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Identified Skill Gaps</h2>
                                    <span className="text-xs font-semibold text-[#6C5CE7] bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">Priority Focus</span>
                                </div>
                                <div className="space-y-4">
                                    {skillGaps.map((gap, idx) => (
                                        <div key={idx} className={`${getSeverityBgColor(gap.severity)} rounded-lg p-4 border ${gap.severity === 'high' ? 'border-red-200 dark:border-red-800' : gap.severity === 'medium' ? 'border-orange-200 dark:border-orange-800' : 'border-blue-200 dark:border-blue-800'}`}>
                                            <div className="flex items-start gap-3">
                                                <span className={`text-lg font-bold ${getSeverityColor(gap.severity)}`}>
                                                    {gap.severity === 'high' ? '⚠️' : gap.severity === 'medium' ? '📌' : 'ℹ️'}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{gap.skill}</p>
                                                    <div className="flex gap-2 mt-2 flex-wrap">
                                                        <span className={`text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                                                            {gap.severity.toUpperCase()} IMPACT
                                                        </span>
                                                        <span className={gap.severity === 'high' ? 'text-red-700 dark:text-red-300' : gap.severity === 'medium' ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}>
                                                            • Reskilling needed
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Download Button */}
                        <button
                            onClick={() => getResumePdf(interviewId)}
                            className="w-full bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Export Resume PDF
                        </button>

                    </div>

                    {/* Right Column - Technical Questions */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-[#6C5CE7]/20 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Questions</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Predicted based on {report.title} focus</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {technicalQuestions.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => setExpandedQIndex(expandedQIndex === idx ? null : idx)}
                                        className="w-full bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 px-6 py-4 flex items-start gap-4 transition-colors"
                                    >
                                        <span className="text-sm font-bold text-[#6C5CE7] bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded min-w-fit">
                                            Q{idx + 1}
                                        </span>
                                        <span className="flex-1 text-left text-gray-900 dark:text-gray-100 font-medium">{q.question}</span>
                                        <svg
                                            className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${expandedQIndex === idx ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>

                                    {expandedQIndex === idx && (
                                        <div className="bg-white dark:bg-slate-800 px-6 py-4 space-y-4 border-t border-gray-200 dark:border-slate-700">
                                            <div>
                                                <p className="text-xs font-semibold text-[#6C5CE7] uppercase tracking-wide mb-2">💡 Interviewer Intention</p>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q.intention}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-[#6C5CE7] uppercase tracking-wide mb-2">✅ How To Answer</p>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Behavioral Questions & Prep Plan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Behavioral Questions */}
                    {behavioralQuestions.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-indigo-200/20 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Behavioral & Leadership</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Soft skills and project management focus</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {behavioralQuestions.map((q, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() => setExpandedBhIndex(expandedBhIndex === idx ? null : idx)}
                                            className="w-full bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 px-6 py-4 flex items-start gap-4 transition-colors"
                                        >
                                            <span className="text-sm font-bold text-[#6C5CE7] bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded min-w-fit">
                                                B{idx + 1}
                                            </span>
                                            <span className="flex-1 text-left text-gray-900 dark:text-gray-100 font-medium">{q.question}</span>
                                            <svg
                                                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${expandedBhIndex === idx ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>

                                        {expandedBhIndex === idx && (
                                            <div className="bg-white dark:bg-slate-800 px-6 py-4 space-y-4 border-t border-gray-200 dark:border-slate-700">
                                                <div>
                                                    <p className="text-xs font-semibold text-[#6C5CE7] uppercase tracking-wide mb-2">💡 Interviewer Intention</p>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q.intention}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-[#6C5CE7] uppercase tracking-wide mb-2">✅ How To Answer</p>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{q.answer}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Preparation Plan */}
                    {preparationPlan.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-200/20 flex items-center justify-center">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2">
                                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{preparationPlan.length}-Day Prep Plan</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Personalized roadmap</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {preparationPlan.slice(0, 7).map((day, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#6C5CE7] text-white font-bold text-sm">
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{day.focus}</h3>
                                            <ul className="mt-2 space-y-1">
                                                {day.tasks.slice(0, 3).map((task, tidx) => (
                                                    <li key={tidx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                                        <span className="text-[#6C5CE7] font-bold mt-0.5">•</span>
                                                        <span>{task}</span>
                                                    </li>
                                                ))}
                                                {day.tasks.length > 3 && (
                                                    <li className="text-xs text-gray-500 italic">+{day.tasks.length - 3} more tasks</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Career Coach CTA */}
                <div className="mt-12 bg-gradient-to-r from-[#6C5CE7] to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-lg">
                    <div className="flex justify-center mb-4">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">Want an expert review?</h3>
                    <p className="mb-6 text-indigo-100">Schedule a 1-on-1 session with our career coaches to get personalized feedback and interview tips.</p>
                    <button className="bg-white text-[#6C5CE7] hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors inline-block">
                        Schedule with a Career Coach
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Interview
