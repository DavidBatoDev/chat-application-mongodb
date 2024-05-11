import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainContainer = () => {
  return (
    <div className='relative bg h-[90vh] w-[90vw] bg-white rounded-3xl flex shadow-lg overflow-hidden'>
        <Sidebar additionalClass='flex-[0.3]' />
        <Outlet />
    </div>
  )
}

export default MainContainer
