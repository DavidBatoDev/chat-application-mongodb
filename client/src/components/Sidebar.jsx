import React, { useState, useEffect } from 'react'
import Conversations from './Conversations';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import MailLockIcon from '@mui/icons-material/MailLock';

const Sidebar = ({darkMode}) => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const mockUsers = [
    {
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      timeStamp: 'today'
    },
    {
      name: 'Jane Doe',
      lastMessage: 'Hello, how are you?',
      timeStamp: 'yesterday'
    },
    {
      name: 'John Smith',
      lastMessage: 'Hello, how are you?',
      timeStamp: '2 days ago'
    },
    {
      name: 'Jane Smith',
      lastMessage: 'Hello, how are you?',
      timeStamp: '3 days ago'
    }
  ]

  useEffect(() => {
    setUsers(mockUsers)
  }, [])

  return (
    <div className={`h-full bg-slate-300 flex-[0.3] ${darkMode && 'dark-secondary'}`}>
      {/* nav */}
      <nav className={`${darkMode && 'dark-primary'} flex justify-between my-5 mx-3 rounded-xl p-3 bg-white`}>
        <div>
          <IconButton>
            <AccountCircleIcon className='text-slate-500' />
          </IconButton>
        </div>
        <div className='flex items-center'>
          <IconButton onClick={() => navigate('users')}>
            <PersonAddIcon className='text-slate-500' />
          </IconButton>
          <IconButton onClick={() => navigate('groups')}>
            <GroupsIcon className='text-slate-500' />
          </IconButton>
          <IconButton onClick={() => navigate('create-group')}>
            <AddCircleIcon className='text-slate-500' />
          </IconButton>
        </div>
      </nav>
      {/* search */}
      <div>
        <div className='flex items-center gap-2 mx-3 my-5'>
          <SearchIcon className='text-slate-500' />
          <input type="text" placeholder='Search' className='w-full bg-transparent border-b-2 border-slate-500 focus:outline-none' />
        </div>
      </div>
      {/* friend-list */}
      <Conversations users={users} />
    </div>
  )
}

export default Sidebar
