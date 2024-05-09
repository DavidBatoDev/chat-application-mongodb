import React from 'react'
import Conversations from './Conversations';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';

const Sidebar = ({additionalClass}) => {
  return (
    <div className={`h-full bg-slate-300 ${additionalClass}`}>
      {/* nav */}
      <nav className='flex  justify-between my-5 mx-3 rounded-xl p-3 bg-white'>
        <div>
          <IconButton>
            <AccountCircleIcon className='text-slate-500' />
          </IconButton>
        </div>
        <div className='flex items-center'>
          <IconButton>
            <PersonAddIcon className='text-slate-500' />
          </IconButton>
          <IconButton>
            <GroupsIcon className='text-slate-500' />
          </IconButton>
          <IconButton>
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
      <Conversations />
    </div>
  )
}

export default Sidebar
