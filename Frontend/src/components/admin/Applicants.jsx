import React, { useEffect, useState } from 'react'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Download, FileText } from 'lucide-react'

const Applicants = () => {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { applicants } = useSelector(store => store.application)
    const [statusFilter, setStatusFilter] = useState('All Applicants')
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const itemsPerPage = 10

    const fetchAllApplicants = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true })
            dispatch(setAllApplicants(res.data.job))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllApplicants()
    }, [params.id, dispatch, refreshKey])

    const handleStatusChange = () => {
        // Trigger a re-fetch by updating refreshKey
        setRefreshKey(prev => prev + 1)
    }

    // Get filtered applicants based on status
    const getFilteredApplicants = () => {
        if (statusFilter === 'All Applicants') {
            return applicants?.applications || []
        } else if (statusFilter === 'Shortlisted') {
            return applicants?.applications?.filter(app => app.status === 'accepted') || []
        } else if (statusFilter === 'Rejected') {
            return applicants?.applications?.filter(app => app.status === 'rejected') || []
        }
        return applicants?.applications || []
    }

    const filteredApplicants = getFilteredApplicants()
    const totalApplicants = applicants?.applications?.length || 0
    const acceptedCount = applicants?.applications?.filter(app => app.status === 'accepted')?.length || 0
    const rejectedCount = applicants?.applications?.filter(app => app.status === 'rejected')?.length || 0
    const pendingCount = totalApplicants - acceptedCount - rejectedCount

    const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage)
    const paginatedApplicants = filteredApplicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleExportCSV = () => {
        if (filteredApplicants.length === 0) {
            alert('No applicants to export')
            return
        }

        const headers = ['Name', 'Email', 'Phone', 'Status', 'Date Applied']
        const rows = filteredApplicants.map(app => [
            app.applicant?.fullname || 'N/A',
            app.applicant?.email || 'N/A',
            app.applicant?.phoneNumber || 'N/A',
            app.status || 'N/A',
            app.applicant?.createdAt ? app.applicant.createdAt.split('T')[0] : 'N/A'
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `applicants-${applicants?.title || 'export'}.csv`
        a.click()
    }

    return (
        <div className='min-h-screen bg-white dark:bg-gray-950'>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header Section */}
                <div className='mb-8'>
                    <button onClick={() => navigate('/admin/jobs')} className='text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 hover:underline'>
                        ← Back to Job Listings
                    </button>
                    
                    <div className='flex items-start justify-between mb-6'>
                        <div>
                            <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-3'>{applicants?.title || 'Job Title'}</h1>
                            <div className='flex items-center gap-3 flex-wrap'>
                                <Badge className='bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 text-sm font-semibold'>
                                    {totalApplicants} APPLICANTS
                                </Badge>
                                <Badge className='bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 text-sm font-semibold'>
                                    ACTIVE ROLE
                                </Badge>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    📅 Posted {Math.floor((new Date() - new Date(applicants?.createdAt)) / (1000 * 24 * 60 * 60))} days ago
                                </span>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <Button variant='outline' onClick={() => navigate(`/admin/jobs/${applicants?._id}/edit`)}>
                                Edit Listing
                            </Button>
                            <Button onClick={handleExportCSV} className='bg-blue-600 hover:bg-blue-700 text-white gap-2'>
                                <Download size={18} />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className='mb-8 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex gap-8 flex-wrap'>
                        {[
                            { label: 'All Applicants', count: totalApplicants },
                            { label: 'Shortlisted', count: acceptedCount },
                            { label: 'Rejected', count: rejectedCount }
                        ].map(tab => (
                            <button
                                key={tab.label}
                                onClick={() => {
                                    setStatusFilter(tab.label)
                                    setCurrentPage(1)
                                }}
                                className={`px-4 py-3 font-semibold text-sm border-b-2 transition ${
                                    statusFilter === tab.label
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className='grid grid-cols-1 gap-8'>
                    {/* Applicants Table - takes 2 columns */}
                    <div className='w-full'>
                        <ApplicantsTable 
                            applicants={paginatedApplicants} 
                            allApplicants={applicants}
                            onStatusChange={handleStatusChange}
                        />

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800'>
                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredApplicants.length)} of {filteredApplicants.length} applicants
                                </p>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className='px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50'
                                    >
                                        ←
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg font-semibold ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className='px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white disabled:opacity-50'
                                    >
                                        →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                      
                </div>
            </div>
        </div>
    )
}

export default Applicants