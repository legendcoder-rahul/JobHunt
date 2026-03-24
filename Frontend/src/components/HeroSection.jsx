import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10'>
            <div className='flex flex-col gap-5 my-10 px-4'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-[#F83002] dark:text-[#F83002] font-medium text-sm md:text-base'>No. 1 Job Hunt Website</span>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold dark:text-white'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
                <p className='dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!</p>
                <div className='flex w-full md:w-[70%] lg:w-[50%] shadow-lg border border-gray-200 dark:border-gray-600 pl-3 rounded-full items-center gap-4 mx-auto dark:bg-gray-800'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-transparent dark:text-white dark:placeholder-gray-400'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] hover:bg-[#5f32ad]">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection