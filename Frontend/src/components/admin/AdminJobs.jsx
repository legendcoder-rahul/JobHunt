import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Badge } from '../ui/badge'
import { Search, ListFilter } from 'lucide-react'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector(store => store.job);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  const totalListings = allAdminJobs?.length || 0;
  const activeApplicants = allAdminJobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0;

  return (
    <div className='min-h-screen bg-white dark:bg-gray-950'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='mb-10'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>My Jobs</h1>
          <p className='text-gray-600 dark:text-gray-400'>Curate and manage your open opportunities across the gallery.</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
          <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
            <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2'>TOTAL LISTINGS</p>
            <p className='text-3xl font-bold text-gray-900 dark:text-white'>{totalListings}</p>
            <p className='text-xs text-green-600 mt-2'>+3 this week</p>
          </div>

          <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
            <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2'>ACTIVE APPLICANTS</p>
            <p className='text-3xl font-bold text-gray-900 dark:text-white'>{activeApplicants}</p>
            <p className='text-xs text-green-600 mt-2'>Top 5% talent</p>
          </div>

          <div className='bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-2'>Boost Your Reach</h3>
            <p className='text-sm text-gray-700 dark:text-gray-300 mb-4'>Promoted listings receive 4x more impressions from high-tier candidates.</p>
            <Button className='w-full bg-purple-600 hover:bg-purple-700 text-white'>
              Upgrade View
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='flex items-center justify-between gap-4 mb-8'>
          <div className='flex-1 max-w-md relative'>
            <Search className='absolute left-3 top-3 text-gray-400' size={18} />
            <Input
              className='pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'
              placeholder='Search by role or company...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button variant='outline' className='flex items-center gap-2'>
            <ListFilter size={18} />
            Filters
          </Button>
          <Button onClick={() => navigate("/admin/jobs/create")} className='bg-purple-600 hover:bg-purple-700 text-white'>
            Post Job
          </Button>
        </div>

        {/* Table */}
        <AdminJobsTable />
      </div>
    </div>
  )
}

export default AdminJobs
