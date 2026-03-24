import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Bookmark, Share2 } from 'lucide-react'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isIntiallyApplied)

    const params = useParams()
    const jobId = params.id
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const applyJobHandler = async () => {
        try {
            const token = localStorage.getItem('token')
            const config = {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                withCredentials: true
            }
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, config)

            if (res.data.success) {
                setIsApplied(true)
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob))
                toast.success(res.data.message)
                
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Already applied to this job')
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const token = localStorage.getItem('token')
                const config = {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    withCredentials: true
                }
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, config)
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    return (
        <div className='min-h-screen bg-white dark:bg-gray-950'>
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8 pb-8 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>{singleJob?.title}</h1>
                            <p className='text-gray-600 dark:text-gray-400'>{singleJob?.company?.name} • {singleJob?.location || 'Location TBA'}</p>
                            {singleJob?.postedDate && <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>Posted {Math.floor((new Date() - new Date(singleJob?.createdAt)) / (1000 * 24 * 60 * 60))} days ago</p>}
                        </div>
                        <div className='flex gap-2'>
                            <Button variant='outline' size='icon'><Bookmark size={20} /></Button>
                            <Button variant='outline' size='icon'><Share2 size={20} /></Button>
                        </div>
                    </div>

                    <div className='flex gap-2 flex-wrap mb-6'>
                        <Badge className='text-xs'>{singleJob?.jobType}</Badge>
                        <Badge className='text-xs'>{singleJob?.position} Positions</Badge>
                        {singleJob?.experience && <Badge className='text-xs'>{singleJob?.experience}+ Years Experience</Badge>}
                    </div>

                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`w-full md:w-auto px-8 py-2 rounded-lg font-semibold ${isApplied ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    >
                        {isApplied ? 'Applied' : 'Apply Now'}
                    </Button>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Content */}
                    <div className='lg:col-span-2'>
                        {/* Quick Info */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                            <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>SALARY RANGE</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>₹{singleJob?.salary}L - ₹{singleJob?.salary + 20}L</p>
                            </div>
                            <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>EXPERIENCE</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>{singleJob?.experience}+ Years</p>
                            </div>
                            <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>JOB TYPE</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>{singleJob?.jobType}</p>
                            </div>
                            <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg'>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>APPLICANTS</p>
                                <p className='font-bold text-gray-900 dark:text-white text-sm'>{singleJob?.applications?.length || 0}</p>
                            </div>
                        </div>

                        {/* Role Overview */}
                        <section className='mb-8'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-4'>Role Overview</h2>
                            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{singleJob?.description || 'No description available'}</p>
                        </section>

                        {/* Core Responsibilities */}
                        <section className='mb-8'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-4'>Core Responsibilities</h2>
                            {singleJob?.requirements && singleJob.requirements.length > 0 ? (
                                <ul className='space-y-3'>
                                    {singleJob.requirements.map((req, index) => (
                                        <li key={index} className='flex items-start gap-3'>
                                            <span className='text-blue-600 mt-1'>✓</span>
                                            <span className='text-gray-700 dark:text-gray-300'>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className='space-y-3'>
                                    <li className='flex items-start gap-3'>
                                        <span className='text-blue-600 mt-1'>✓</span>
                                        <span className='text-gray-700 dark:text-gray-300'>Design and implement scalable backend services</span>
                                    </li>
                                    <li className='flex items-start gap-3'>
                                        <span className='text-blue-600 mt-1'>✓</span>
                                        <span className='text-gray-700 dark:text-gray-300'>Architect and manage database schemas</span>
                                    </li>
                                    <li className='flex items-start gap-3'>
                                        <span className='text-blue-600 mt-1'>✓</span>
                                        <span className='text-gray-700 dark:text-gray-300'>Collaborate with product and design teams on technical requirements</span>
                                    </li>
                                    <li className='flex items-start gap-3'>
                                        <span className='text-blue-600 mt-1'>✓</span>
                                        <span className='text-gray-700 dark:text-gray-300'>Optimize performance and ensure high system reliability</span>
                                    </li>
                                </div>
                            )}
                        </section>

                        {/* Technical Stack */}
                        <section className='mb-8'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-4'>Technical Stack</h2>
                            <div className='flex flex-wrap gap-2'>
                                {['React', 'Node.js', 'PostgreSQL', 'AWS', 'TypeScript', 'GraphQL', 'Docker', 'Redis'].map(tech => (
                                    <Badge key={tech} className='bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>{tech}</Badge>
                                ))}
                            </div>
                        </section>

                        {/* What We Offer */}
                        <section>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-600 pl-4'>What We Offer</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                                    <p className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>💰 Competitive Salary</p>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm'>Industry-leading compensation with performance bonus</p>
                                </div>
                                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                                    <p className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>🏥 Health Benefits</p>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm'>Comprehensive medical and dental coverage</p>
                                </div>
                                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                                    <p className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>📚 Learning Budget</p>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm'>Annual training and conference budget</p>
                                </div>
                                <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                                    <p className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>🌍 Remote Flexibility</p>
                                    <p className='text-gray-600 dark:text-gray-400 text-sm'>Work from anywhere with flexible hours</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <div>
                        {/* About Company */}
                        <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-6'>
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-3'>About the Company</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm mb-4'>{singleJob?.company?.description || 'Leading innovative tech company'}</p>
                            <Button variant='outline' className='w-full'>View Company Profile →</Button>
                        </div>

                        {/* Similar Openings */}
                        {singleJob?.company && (
                            <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg'>
                                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>Similar Openings</h3>
                                <div className='space-y-3'>
                                    <div className='cursor-pointer hover:bg-white dark:hover:bg-gray-800 p-3 rounded transition'>
                                        <p className='font-semibold text-gray-900 dark:text-white text-sm'>Full Stack Developer</p>
                                        <p className='text-xs text-gray-600 dark:text-gray-400'>$60K - $80K</p>
                                    </div>
                                    <div className='cursor-pointer hover:bg-white dark:hover:bg-gray-800 p-3 rounded transition'>
                                        <p className='font-semibold text-gray-900 dark:text-white text-sm'>DevOps Engineer</p>
                                        <p className='text-xs text-gray-600 dark:text-gray-400'>$70K - $90K</p>
                                    </div>
                                    <div className='cursor-pointer hover:bg-white dark:hover:bg-gray-800 p-3 rounded transition'>
                                        <p className='font-semibold text-gray-900 dark:text-white text-sm'>QA Automation Lead</p>
                                        <p className='text-xs text-gray-600 dark:text-gray-400'>$55K - $75K</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription