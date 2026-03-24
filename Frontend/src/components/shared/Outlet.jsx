import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet as RouterOutlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-gray-950 dark:text-white'>
        <Navbar/>
        <main className='flex-grow'>
            <RouterOutlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default RootLayout