import React, { useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Mail, Phone, FileText, Download, Eye, Plus } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='bg-white dark:bg-gray-950 min-h-screen'>
            {/* Profile Header */}
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='flex justify-between items-center mb-8'>
                    <div className='flex items-center gap-6'>
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='text-2xl font-bold dark:text-white'>{user?.fullname}</h1>
                            <div className='mt-2 space-y-1 dark:text-gray-400 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <Mail size={16} />
                                    <span>{user?.email}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Phone size={16} />
                                    <span>{user?.phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className='bg-blue-600 hover:bg-blue-700 text-white'>
                        Edit Profile
                    </Button>
                </div>

                {/* Skills and Resume Section */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    {/* Skills Card */}
                    <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800'>
                        <h2 className='flex items-center gap-2 text-lg font-semibold dark:text-white mb-6'>
                            <span className='text-blue-600'>◆</span> Skills
                        </h2>
                        <div className='min-h-32 flex flex-col items-center justify-center'>
                            {user?.profile?.skills && user?.profile?.skills.length > 0 ? (
                                <div className='w-full'>
                                    <div className='flex flex-wrap gap-2'>
                                        {user.profile.skills.map((skill, idx) => (
                                            <Badge key={idx} className='bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'>
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <div className='mb-4'>
                                        <Plus size={40} className='mx-auto text-gray-400' />
                                    </div>
                                    <p className='text-gray-600 dark:text-gray-400 font-medium'>No skills added yet</p>
                                    <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>Let recruiters know what you're best at.</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => setOpen(true)} className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white'>
                            Add Skills
                        </Button>
                    </div>

                    {/* Resume Card */}
                    <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800'>
                        <h2 className='flex items-center gap-2 text-lg font-semibold dark:text-white mb-6'>
                            <span className='text-purple-600'>◆</span> Resume
                        </h2>
                        <div className='min-h-32 flex flex-col items-center justify-center'>
                            {user?.profile?.resume ? (
                                <div className='w-full'>
                                    <div className='flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                        <FileText className='text-red-500' size={32} />
                                        <div className='flex-1'>
                                            <p className='font-medium dark:text-white truncate'>{user.profile.resumeOriginalName || 'Resume.pdf'}</p>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>Uploaded on March 25, 2024</p>
                                        </div>
                                        <div className='flex gap-2'>
                                            <a href={user.profile.resume} download target="_blank" rel="noopener noreferrer">
                                                <Button size='sm' variant='ghost' className='text-gray-600 dark:text-gray-400'>
                                                    <Download size={18} />
                                                </Button>
                                            </a>
                                            <a href={user.profile.resume} target="_blank" rel="noopener noreferrer">
                                                <Button size='sm' variant='ghost' className='text-gray-600 dark:text-gray-400'>
                                                    <Eye size={18} />
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    <div className='mb-4'>
                                        <FileText size={40} className='mx-auto text-gray-400' />
                                    </div>
                                    <p className='text-gray-600 dark:text-gray-400 font-medium'>No resume uploaded</p>
                                    <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>Upload a resume to apply for jobs</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={() => setOpen(true)} className='w-full mt-6 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-blue-500 dark:text-blue-400 bg-white dark:bg-gray-900'>
                            {user?.profile?.resume ? 'Update New Resume' : 'Upload Resume'}
                        </Button>
                    </div>
                </div>

                {/* Applied Jobs Section */}
                <div>
                    <h2 className='text-xl font-bold dark:text-white mb-4'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>
            </div>

            {/* Update Profile Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
                