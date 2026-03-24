import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, Briefcase } from 'lucide-react'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 1,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value, fieldName) => {
        if (fieldName === 'company') {
            setInput({ ...input, companyId: value });
        } else {
            setInput({ ...input, [fieldName]: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!input.title || !input.description || !input.requirements || !input.salary || !input.location || !input.jobType || !input.experience || !input.position || !input.companyId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const formData = {
                ...input,
                position: parseInt(input.position),
                experience: parseInt(input.experience)
            };
            console.log('Posting job with data:', formData);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error('Job posting error:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-white dark:bg-gray-950 py-12'>
            <div className='max-w-3xl mx-auto px-4'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center gap-3 mb-2'>
                        <Briefcase size={28} className='text-blue-600' />
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Post a New Job</h1>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400'>Fill in the details below to find your next great hire on JobHunter.</p>
                </div>

                {/* Form */}
                <form onSubmit={submitHandler} className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden'>
                    <div className='p-8'>
                        {/* Job Title */}
                        <div className='mb-8'>
                            <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Job Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Senior UI/UX Designer"
                                value={input.title}
                                onChange={changeEventHandler}
                                className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600'
                                required
                            />
                        </div>

                        {/* THE NARRATIVE Section */}
                        <div className='mb-8 pb-8 border-b border-gray-200 dark:border-gray-800'>
                            <div className='flex items-center gap-2 mb-6'>
                                <div className='w-2 h-2 rounded-full bg-blue-600'></div>
                                <span className='text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400'>THE NARRATIVE</span>
                            </div>

                            {/* Job Description */}
                            <div className='mb-6'>
                                <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Job Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe the role, the team culture, and the impact this person will make..."
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    rows="4"
                                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none'
                                    required
                                />
                            </div>

                            {/* Key Responsibilities */}
                            <div className='mb-6'>
                                <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Key Responsibilities</label>
                                <textarea
                                    name="requirements"
                                    placeholder="Enter comma-separated responsibilities (e.g. Design APIs, Database management, Team collaboration)"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    rows="4"
                                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none'
                                    required
                                />
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Tip: Use commas to separate multiple items</p>
                            </div>
                        </div>

                        {/* LOGISTICS Section */}
                        <div>
                            <div className='flex items-center gap-2 mb-6'>
                                <div className='w-2 h-2 rounded-full bg-purple-600'></div>
                                <span className='text-xs font-bold tracking-widest text-purple-600 dark:text-purple-400'>LOGISTICS</span>
                            </div>

                            {/* Salary Range and Location */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Salary Range</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        placeholder="$ 80k - 120k"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="Remote / New York, NY"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600'
                                        required
                                    />
                                </div>
                            </div>

                            {/* Job Type and Experience Level */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Job Type</label>
                                    <Select value={input.jobType} onValueChange={(value) => selectChangeHandler(value, 'jobType')}>
                                        <SelectTrigger className='w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'>
                                            <SelectValue placeholder="Full-time" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-white dark:bg-gray-800'>
                                            <SelectGroup>
                                                <SelectItem value='Full-time'>Full-time</SelectItem>
                                                <SelectItem value='Part-time'>Part-time</SelectItem>
                                                <SelectItem value='Contract'>Contract</SelectItem>
                                                <SelectItem value='Internship'>Internship</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Experience Level</label>
                                    <Select value={input.experience} onValueChange={(value) => selectChangeHandler(value, 'experience')}>
                                        <SelectTrigger className='w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'>
                                            <SelectValue placeholder="Entry Level" />
                                        </SelectTrigger>
                                        <SelectContent className='bg-white dark:bg-gray-800'>
                                            <SelectGroup>
                                                <SelectItem value='0'>Entry Level</SelectItem>
                                                <SelectItem value='1'>Junior (1-2 years)</SelectItem>
                                                <SelectItem value='2'>Mid-level (2-5 years)</SelectItem>
                                                <SelectItem value='5'>Senior (5+ years)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Number of Positions and Company Selection */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Number of Positions</label>
                                    <input
                                        type="number"
                                        name="position"
                                        min="1"
                                        value={input.position}
                                        onChange={changeEventHandler}
                                        className='w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-gray-900 dark:text-white mb-3'>Select Company</label>
                                    {companies.length > 0 ? (
                                        <Select value={input.companyId} onValueChange={(value) => selectChangeHandler(value, 'company')}>
                                            <SelectTrigger className='w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'>
                                                <SelectValue placeholder="Choose a company profile..." />
                                            </SelectTrigger>
                                            <SelectContent className='bg-white dark:bg-gray-800'>
                                                <SelectGroup>
                                                    {companies.map((company) => (
                                                        <SelectItem key={company._id} value={company._id}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className='px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm'>
                                            No companies available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Error Message */}
                            {companies.length === 0 && (
                                <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                                    <p className='text-red-700 dark:text-red-300 text-sm font-semibold'>
                                        ⚠️ Please register a company first before posting a job
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            {loading ? (
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold" disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Posting Job...
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base"
                                    disabled={companies.length === 0}
                                >
                                    ▶ Post New Job
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PostJob