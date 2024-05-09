import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';

const Message = ({user}) => {
  return (
    <div className={`flex items-center my-3 w-full`}>
        <div className={`flex flex-row items-center`}>
        <IconButton>
            <AccountCircleIcon className='text-slate-500' />
        </IconButton>
        <div className='flex flex-col bg-slate-300 p-3 rounded-xl min-w-14 max-w-40 md:max-w-72 lg:max-w-96'>
            <h1 className='font-semibold'>John Doe</h1>
            <p className={`text-sm text-wrap break-words`}>How are you?</p>
        </div>
        </div>
    </div>
  )
}

export default Message
