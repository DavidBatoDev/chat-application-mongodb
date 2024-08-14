import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainContainer = () => {
  return (
    <div className='relative bg sm:h-[95vh] sm:w-[95vw] md:h-[85vh] md:w-[85vw] h-screen w-screen bg-white sm:rounded-3xl flex shadow-lg overflow-hidden'>
        <Sidebar />
        <Outlet />
    </div>
  )
}

export default MainContainer
