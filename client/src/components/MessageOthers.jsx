import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

const MessageOthers = ({message}) => {
  const {darkMode} = useSelector(state => state.theme)

  return (
    <div className={`flex items-center my-3 w-full`}>
        <div className={`flex flex-row items-center`}>
        <IconButton>
            <AccountCircleIcon className='text-slate-500' />
        </IconButton>
        <div className={`${darkMode && 'dark-secondary'} flex flex-col bg-slate-300 p-2 rounded-xl  min-w-56 max-w-40 md:max-w-72 lg:max-w-96`}>
            <h1 className='font-semibold'>
              {message.sender.name}
            </h1>
            <p className={`text-sm text-wrap break-words`}>
              {message.content}
            </p>
            <span className='flex justify-end text-xs text-gray-400'>
              today
            </span>
        </div>
        </div>
    </div>
  )
}

export default MessageOthers
