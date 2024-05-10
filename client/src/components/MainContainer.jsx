import React from 'react'
import Sidebar from './Sidebar'
import NoConvoOpen from './NoConvoOpen'
import CreateGroup from './CreateGroup'
import ActiveUsers from './ActiveUsers'
import ChatArea from './ChatArea'

const MainContainer = () => {
  return (
    <div className='relative bg h-[90vh] w-[90vw] bg-white rounded-3xl flex shadow-lg overflow-hidden'>
        <Sidebar additionalClass='flex-[0.3]' />
        {/* <ChatArea /> */}
        {/* <NoConvoOpen /> */}
        {/* <CreateGroup /> */}
        <ActiveUsers />
    </div>
  )
}

export default MainContainer
