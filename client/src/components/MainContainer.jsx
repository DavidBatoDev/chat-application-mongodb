import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const MainContainer = ({socket}) => {
  return (
    <div className='relative bg md:h-[90vh] md:w-[90vw] h-screen w-screen bg-white md:rounded-3xl flex shadow-lg overflow-hidden'>
        <Sidebar socket={socket}/>
        <Outlet />
    </div>
  )
}

export default MainContainer
