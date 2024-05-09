import React from 'react'

const MessageSelf = () => {
  return (
    <div className={`flex items-center my-3 w-full justify-end`}>
    <div className={`flex flex-row-reverse justify-start items-center`}>
      <div className='flex flex-col bg-slate-300 p-3 rounded-xl min-w-56 max-w-40 md:max-w-72 lg:max-w-96'>
        <p className={`flex justify-end text-sm md:text-md text-wrap break-words`}>
            This is a Sample Message from myself
        </p>
        <span className='flex justify-end text-xs text-gray-400'>today</span>
      </div>
    </div>
  </div>
  )
}

export default MessageSelf
