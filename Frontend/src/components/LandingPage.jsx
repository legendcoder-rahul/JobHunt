import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const [query, setQuery] = useState("")
    const [email, setEmail] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { allJobs } = useSelector(store => store.job)

    const searchJobHandler = () => {
        if (query.trim()) {
            dispatch(setSearchedQuery(query))
            navigate("/browse")
        }
    }

    const handleSubscribe = () => {
        if (email.trim()) {
            console.log("Subscribed:", email)
            setEmail("")
        }
    }

    const categories = [
        { icon: '💻', title: 'Frontend Dev', roles: 'Full-time • Remote', description: 'Build user interfaces with latest tech' },
        { icon: '🔧', title: 'Backend Dev', roles: 'Full-time • On-site', description: 'APIs, databases, and architecture' },
        { icon: '🎨', title: 'UI/UX Design', roles: 'Full-time • Remote', description: 'Create beautiful user experiences' },
        { icon: '📊', title: 'Data Science', roles: 'Full-time • Remote', description: 'Analyze data and drive insights' }
    ]

    const features = [
        { icon: Users, title: 'Vetted Companies', description: 'We manually review every company to ensure high growth potential and culture alignment.' },
        { icon: TrendingUp, title: 'Early Access', description: 'Get notified about premium roles before they go public on job boards.' },
        { icon: Shield, title: 'Salary Transparency', description: 'Most of our listings include verified salary ranges and equity details upfront.' }
    ]

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-full">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">🚀 THE DIGITAL CURATED FOR TECH TALENT</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Jobs that
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Actually fit you</span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
                            Explore high-growth tech careers from top-tier global companies. We prioritize quality over quantity to find your perfect fit.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <div className="flex-1 max-w-md relative">
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchJobHandler()}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Button
                            onClick={searchJobHandler}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-lg font-semibold text-[16px]"
                        >
                            Search Jobs
                        </Button>
                    </div>

                    {/* Popular Tags */}
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Popular: Product Designer • Next Engineer • AI Researcher</p>
                    </div>
                </div>
            </section>

            {/* Explore by Category */}
            <section className="py-20 px-4 bg-white dark:bg-gray-950">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Explore by Category</h2>
                            <p className="text-gray-600 dark:text-gray-400">Discover roles tailored to your expertise and career aspirations.</p>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            View All Categories <ArrowRight size={16} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat, idx) => (
                            <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition cursor-pointer">
                                <div className="text-3xl mb-3">{cat.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{cat.roles}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{cat.description}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-3">6 EXPLORE ROLES →</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why JobHunter */}
            <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">Why JobHunter?</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
                        We're not just a job board. We're your professional partner.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <feature.icon className="text-blue-600 dark:text-blue-400" size={24} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Job Openings */}
            <section className="py-20 px-4 bg-white dark:bg-gray-950">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Latest Job Openings</h2>
                        <Button variant="outline">Most Recent</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {allJobs && allJobs.length > 0 ? allJobs.slice(0, 4).map((job) => (
                            <div key={job._id} onClick={() => navigate(`/description/${job._id}`)} className='p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition cursor-pointer'>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="text-3xl">💼</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{job?.title || 'Job Title'}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{job?.company?.name || 'Company'} • {job?.location || 'Location'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">{job?.jobType}</span>
                                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">{job?.position} Positions</span>
                                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">{job?.salary}LPA</span>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">View Details</Button>
                            </div>
                        )) : (
                            <div className="col-span-2 text-center py-10">
                                <p className="text-gray-500 dark:text-gray-400">No jobs available at the moment</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <Button variant="outline" className="px-8 py-3" onClick={() => navigate('/jobs')}>
                            Load More Jobs
                        </Button>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Curated roles, straight to your inbox.</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join 50,000+ tech professionals who receive our weekly selection of the best roles in tech.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <Button
                            onClick={handleSubscribe}
                            className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 font-semibold"
                        >
                            Subscribe Now
                        </Button>
                    </div>

                    <p className="text-blue-100 text-xs mt-4">No spam. Only high-value opportunities. Unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
