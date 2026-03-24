import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'

const Browse = () => {
    useGetAllJobs()
    const { allJobs, searchedQuery } = useSelector(store => store.job)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const [filters, setFilters] = useState({
        jobType: [],
        salaryRange: { min: 0, max: 100 },
        experience: []
    })
    const [currentPage, setCurrentPage] = useState(1)
    const jobsPerPage = 6

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""))
        }
    }, [dispatch])

    // Filter jobs based on search query and filters
    const filteredJobs = allJobs?.filter(job => {
        const matchesSearch = !searchedQuery || job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) || job?.company?.name?.toLowerCase().includes(searchedQuery.toLowerCase())
        const matchesJobType = filters.jobType.length === 0 || filters.jobType.includes(job?.jobType)
        const matchesSalary = job?.salary >= filters.salaryRange.min && job?.salary <= filters.salaryRange.max
        const matchesExperience = filters.experience.length === 0 || filters.experience.includes(String(job?.experience))
        
        return matchesSearch && matchesJobType && matchesSalary && matchesExperience
    })

    // Pagination
    const paginatedJobs = filteredJobs?.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)
    const totalPages = Math.ceil(filteredJobs?.length / jobsPerPage)

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'jobType') {
            setFilters(prev => ({
                ...prev,
                jobType: prev.jobType.includes(value) ? prev.jobType.filter(f => f !== value) : [...prev.jobType, value]
            }))
        } else if (filterType === 'experience') {
            setFilters(prev => ({
                ...prev,
                experience: prev.experience.includes(value) ? prev.experience.filter(f => f !== value) : [...prev.experience, value]
            }))
        }
        setCurrentPage(1)
    }

    const daysAgo = (mongodbTime) => {
        const createdAt = new Date(mongodbTime)
        const currentTime = new Date()
        const timeDifference = currentTime - createdAt
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60))
    }

    return (
        <div className='min-h-screen bg-white dark:bg-gray-950'>
            
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Search Bar */}
                <div className='mb-8 flex gap-4'>
                    <div className='flex-1 relative'>
                        <Search className='absolute left-3 top-3 text-gray-400' size={20} />
                        <input
                            type='text'
                            placeholder='Job title, keywords, or company'
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 dark:text-white'
                        />
                    </div>
                </div>

                <div className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
                    Showing {filteredJobs?.length} curated positions
                </div>

                <div className='flex gap-8'>
                    {/* Left Sidebar - Filters */}
                    <div className='hidden md:block w-48'>
                        {/* Job Type */}
                        <div className='mb-8'>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>Job Type</h3>
                            <div className='space-y-3'>
                                {['Full-time', 'Part-time', 'Internship'].map(type => (
                                    <label key={type} className='flex items-center gap-3 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            checked={filters.jobType.includes(type)}
                                            onChange={() => handleFilterChange('jobType', type)}
                                            className='w-4 h-4'
                                        />
                                        <span className='text-gray-700 dark:text-gray-300'>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div className='mb-8'>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>Salary Range</h3>
                            <input
                                type='range'
                                min='0'
                                max='100'
                                value={filters.salaryRange.max}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    salaryRange: { ...prev.salaryRange, max: parseInt(e.target.value) }
                                }))}
                                className='w-full'
                            />
                            <div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                                ₹0 - ₹{filters.salaryRange.max}L
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div className='mb-8'>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>Experience Level</h3>
                            <div className='space-y-3'>
                                {['0', '1', '2', '3', '5'].map(exp => (
                                    <label key={exp} className='flex items-center gap-3 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            checked={filters.experience.includes(exp)}
                                            onChange={() => handleFilterChange('experience', exp)}
                                            className='w-4 h-4'
                                        />
                                        <span className='text-gray-700 dark:text-gray-300'>{exp}+ Years</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Job Listings */}
                    <div className='flex-1'>
                        <div className='space-y-6'>
                            {paginatedJobs?.length > 0 ? paginatedJobs.map(job => (
                                <div key={job._id} className='p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition'>
                                    <div className='flex items-start justify-between mb-4'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-3 mb-2'>
                                                <div className='text-2xl'>💼</div>
                                                <div>
                                                    <h3 className='font-semibold text-gray-900 dark:text-white text-lg'>{job?.title}</h3>
                                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{job?.company?.name} • {job?.location || 'Location TBA'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-semibold text-gray-900 dark:text-white'>₹{job?.salary}L - ₹{job?.salary + 5}L</p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>Posted {daysAgo(job?.createdAt) === 0 ? 'Today' : `${daysAgo(job?.createdAt)} days ago`}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-wrap gap-2 mb-4'>
                                        <Badge className='text-xs'>{job?.jobType}</Badge>
                                        <Badge className='text-xs'>{job?.position} Position{job?.position > 1 ? 's' : ''}</Badge>
                                        {job?.experience && <Badge className='text-xs'>{job?.experience}+ Years</Badge>}
                                    </div>

                                    <div className='flex gap-3'>
                                        <Button 
                                            onClick={() => navigate(`/description/${job?._id}`)}
                                            className='bg-blue-600 hover:bg-blue-700 text-white'
                                        >
                                            Details
                                        </Button>
                                        <Button variant='outline'>Save</Button>
                                    </div>
                                </div>
                            )) : (
                                <div className='text-center py-12'>
                                    <p className='text-gray-500 dark:text-gray-400'>No jobs found matching your criteria</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='flex justify-center items-center gap-2 mt-8'>
                                <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded'>←</button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded'>→</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Browse