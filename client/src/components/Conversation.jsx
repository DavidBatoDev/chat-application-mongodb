import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';

const Conversation = ({user, onClick}) => {
  const {darkMode} = useSelector(state => state.theme)
  return (
    <div className={`active:bg-slate-200 flex items-center px-5 py-3 gap-2 ${darkMode ? 'hover:bg-gray-900 active:bg-gray-900' : 'hover:bg-slate-300 active:bg-slate-300' }  cursor-pointer`} onClick={onClick}>
        <AccountCircleIcon className='text-slate-500' />
        <div>
            <h1 className='text-md font-semibold'>{user.name}</h1>
            <p className='text-xs text-slate-500'>{user.lastMessage}</p>
        </div>
    </div>
  )
}

export default Conversation
