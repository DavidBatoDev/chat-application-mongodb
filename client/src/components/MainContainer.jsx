import React from 'react'
import Sidebar from './Sidebar'
import MainArea from './MainArea'

const MainContainer = () => {
  return (
    <div className='bg h-[90vh] w-[90vw] bg-white rounded-3xl flex shadow-lg overflow-hidden'>
        <Sidebar additionalClass='flex-[0.3]' />
        <MainArea additionalClass="flex-[0.7]"/>
    </div>
  )
}

export default MainContainer
