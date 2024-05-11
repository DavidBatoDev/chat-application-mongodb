import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Conversation = ({user, onClick}) => {
  return (
    <div className='flex items-center px-5 py-3 gap-2 hover:bg-slate-200 cursor-pointer' onClick={onClick}>
        <AccountCircleIcon className='text-slate-500' />
        <div>
            <h1 className='text-md font-semibold'>{user.name}</h1>
            <p className='text-xs text-slate-500'>{user.lastMessage}</p>
        </div>
    </div>
  )
}

export default Conversation
