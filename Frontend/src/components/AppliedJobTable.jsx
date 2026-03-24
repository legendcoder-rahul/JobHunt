import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div className='w-full overflow-x-auto dark:bg-gray-800 rounded-lg'>
            <Table>
                <TableCaption className='dark:text-gray-400'>A list of your applied jobs</TableCaption>
                <TableHeader className='dark:bg-gray-700'>
                    <TableRow className='dark:border-b-gray-600'>
                        <TableHead className='dark:text-white text-xs sm:text-sm'>Date</TableHead>
                        <TableHead className='dark:text-white text-xs sm:text-sm'>Job Role</TableHead>
                        <TableHead className='dark:text-white text-xs sm:text-sm hidden sm:table-cell'>Company</TableHead>
                        <TableHead className="text-right dark:text-white text-xs sm:text-sm">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center dark:text-gray-400 text-xs sm:text-sm py-4">You haven't applied any job yet.</TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className='dark:border-b-gray-600'>
                                <TableCell className='dark:text-gray-300 text-xs sm:text-sm'>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className='dark:text-gray-300 text-xs sm:text-sm'>
                                    <div>
                                        <p>{appliedJob.job?.title}</p>
                                        <p className='sm:hidden text-gray-500 dark:text-gray-400 text-xs'>{appliedJob.job?.company?.name}</p>
                                    </div>
                                </TableCell>
                                <TableCell className='dark:text-gray-300 text-xs sm:text-sm hidden sm:table-cell'>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right"><Badge className={`text-xs ${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable