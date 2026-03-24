import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    return (
        <div className='dark:bg-gray-800 rounded-lg overflow-auto'>
            <Table>
                <TableCaption className='dark:text-gray-400'>A list of your applied jobs</TableCaption>
                <TableHeader className='dark:bg-gray-700'>
                    <TableRow className='dark:border-b-gray-600'>
                        <TableHead className='dark:text-white'>Date</TableHead>
                        <TableHead className='dark:text-white'>Job Role</TableHead>
                        <TableHead className='dark:text-white'>Company</TableHead>
                        <TableHead className="text-right dark:text-white">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center dark:text-gray-400">You haven't applied any job yet.</TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id} className='dark:border-b-gray-600'>
                                <TableCell className='dark:text-gray-300'>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className='dark:text-gray-300'>{appliedJob.job?.title}</TableCell>
                                <TableCell className='dark:text-gray-300'>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right"><Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>{appliedJob.status.toUpperCase()}</Badge></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable