import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { MoreHorizontal, FileText, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'

const ApplicantsTable = ({ applicants, allApplicants, onStatusChange }) => {
    const [loadingId, setLoadingId] = useState(null)

    const statusHandler = async (status, id) => {
        try {
            setLoadingId(id)
            // Convert status to lowercase
            const normalizedStatus = status.toLowerCase().trim()
            console.log('Sending status:', normalizedStatus, 'for ID:', id)
            
            // Use PUT request instead of POST (backend route is PUT)
            const res = await axios.put(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status: normalizedStatus },
                { withCredentials: true }
            )
            
            console.log('Status update response:', res.data)
            
            if (res.data.success) {
                toast.success(res.data.message || 'Status updated successfully')
                // Notify parent component to refresh data
                if (onStatusChange) {
                    onStatusChange()
                }
            }
        } catch (error) {
            console.error('Status update error:', error.response?.data || error.message)
            toast.error(error.response?.data?.message || 'Failed to update applicant status')
        } finally {
            setLoadingId(null)
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            case 'rejected':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }
    }

    if (!applicants || applicants.length === 0) {
        return (
            <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden'>
                <div className='text-center py-12'>
                    <p className='text-gray-500 dark:text-gray-400'>No applicants found</p>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                        <tr>
                            <th className='px-6 py-4 text-left text-xs font-bold text-gray-900 dark:text-white tracking-wider'>NAME</th>
                            <th className='px-6 py-4 text-left text-xs font-bold text-gray-900 dark:text-white tracking-wider'>EMAIL</th>
                            <th className='px-6 py-4 text-left text-xs font-bold text-gray-900 dark:text-white tracking-wider'>CONTACT</th>
                            <th className='px-6 py-4 text-left text-xs font-bold text-gray-900 dark:text-white tracking-wider'>RESUME</th>
                            <th className='px-6 py-4 text-left text-xs font-bold text-gray-900 dark:text-white tracking-wider'>DATE APPLIED</th>
                            <th className='px-6 py-4 text-right text-xs font-bold text-gray-900 dark:text-white tracking-wider'>ACTION</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                        {applicants.map((item) => (
                            <tr key={item._id} className='hover:bg-gray-50 dark:hover:bg-gray-800/50 transition'>
                                <td className='px-6 py-4'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar>
                                            <AvatarImage src={item.applicant?.profile?.profilePhoto} />
                                            <AvatarFallback className='bg-blue-600 text-white'>
                                                {item.applicant?.fullname?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className='font-semibold text-gray-900 dark:text-white'>{item.applicant?.fullname || 'N/A'}</p>
                                            <p className='text-xs text-gray-600 dark:text-gray-400'>{item.applicant?.profile?.bio || 'No title'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 text-gray-700 dark:text-gray-300'>{item.applicant?.email || 'N/A'}</td>
                                <td className='px-6 py-4 text-gray-700 dark:text-gray-300'>{item.applicant?.phoneNumber || 'N/A'}</td>
                                <td className='px-6 py-4'>
                                    {item.applicant?.profile?.resume ? (
                                        <a
                                            href={item.applicant.profile.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline'
                                        >
                                            <FileText size={16} />
                                            <span className='text-sm'>{item.applicant.profile.resumeOriginalName || 'Resume'}</span>
                                        </a>
                                    ) : (
                                        <span className='text-gray-500 dark:text-gray-400 text-sm'>-</span>
                                    )}
                                </td>
                                <td className='px-6 py-4 text-gray-700 dark:text-gray-300'>
                                    {item.applicant?.createdAt ? new Date(item.applicant.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className='px-6 py-4 text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        {item.status === 'accepted' ? (
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                                <CheckCircle size={14} />
                                                Shortlisted
                                            </span>
                                        ) : item.status === 'rejected' ? (
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                                                <XCircle size={14} />
                                                Rejected
                                            </span>
                                        ) : (
                                            <Button
                                                onClick={() => statusHandler('accepted', item._id)}
                                                disabled={loadingId === item._id}
                                                size='sm'
                                                className='bg-gray-600 hover:bg-gray-700 text-white'
                                            >
                                                {loadingId === item._id ? 'Loading...' : 'Shortlist'}
                                            </Button>
                                        )}

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className='p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition'>
                                                    <MoreHorizontal size={18} className='text-gray-600 dark:text-gray-400' />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className='w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2'>
                                                <div className='space-y-2'>
                                                    <button
                                                        onClick={() => statusHandler('accepted', item._id)}
                                                        disabled={loadingId === item._id || item.status === 'accepted'}
                                                        className='w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 transition'
                                                    >
                                                        ✓ Accept
                                                    </button>
                                                    <button
                                                        onClick={() => statusHandler('rejected', item._id)}
                                                        disabled={loadingId === item._id || item.status === 'rejected'}
                                                        className='w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-red-600 dark:text-red-400 disabled:opacity-50 transition'
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ApplicantsTable