import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-lg transition'>
            <div>
                <h1 className='font-medium text-lg dark:text-white'>{job?.company?.name || 'Company Not Available'}</h1>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{job?.location || 'Location Not Specified'}</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2 dark:text-white'>{job?.title || 'Job Title'}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{job?.description || 'No description provided'}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards