import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Conversation = () => {
  return (
<div className='flex items-center px-5 py-3 gap-2'>
    <AccountCircleIcon className='text-slate-500' />
    <span className='text-lg'>Friend</span>
</div>
  )
}

export default Conversation
