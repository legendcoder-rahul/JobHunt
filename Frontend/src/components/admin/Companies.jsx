import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Search, ListFilter, Plus } from 'lucide-react'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input, dispatch]);

    const totalPortfolio = companies?.length || 0;
    const activeListings = companies?.reduce((sum, company) => sum + (company.jobs?.length || 0), 0) || 0;

    return (
        <div className='min-h-screen bg-white dark:bg-gray-950'>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header Section */}
                <div className='mb-10'>
                    <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>My Companies</h1>
                    <p className='text-gray-600 dark:text-gray-400'>Curate and manage your portfolio of registered organizations. Monitor growth, verify credentials, and oversee talent acquisition across your network.</p>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
                    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                        <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2'>TOTAL PORTFOLIO</p>
                        <p className='text-3xl font-bold text-gray-900 dark:text-white'>{totalPortfolio}</p>
                        <p className='text-xs text-green-600 mt-2'>+12%</p>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                        <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2'>ACTIVE LISTINGS</p>
                        <p className='text-3xl font-bold text-gray-900 dark:text-white'>{activeListings}</p>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                        <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2'>VERIFIED BRANDS</p>
                        <p className='text-3xl font-bold text-gray-900 dark:text-white'>38</p>
                        <div className='flex items-center gap-1 mt-2'>
                            <span className='w-2 h-2 rounded-full bg-purple-600'></span>
                            <p className='text-xs text-purple-600'>Premium</p>
                        </div>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                        <p className='text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2'>AVG. RESPONSE</p>
                        <p className='text-3xl font-bold text-gray-900 dark:text-white'>4.2h</p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className='flex items-center justify-between gap-4 mb-8'>
                    <div className='flex-1 max-w-md relative'>
                        <Search className='absolute left-3 top-3 text-gray-400' size={18} />
                        <Input
                            className='pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'
                            placeholder='Search companies by name, industry or location...'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <Button variant='outline' className='flex items-center gap-2'>
                        <ListFilter size={18} />
                        Filters
                    </Button>
                    <Button onClick={() => navigate("/admin/companies/create")} className='bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2'>
                        <Plus size={18} />
                        New Company
                    </Button>
                </div>

                {/* Table */}
                <CompaniesTable/>
            </div>
        </div>
    )
}

export default Companies