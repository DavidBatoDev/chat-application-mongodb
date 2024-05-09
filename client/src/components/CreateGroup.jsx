import React from 'react'
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const CreateGroup = () => {
  return (
    <div className='flex flex-col gap-2 mt-2 h-full'>
        <div className='flex justify-between w-full bg-white mt-3 rounded-xl py-2 shadow-sm'>
            <input 
                type="text" 
                placeholder='Enter Group Name..'
                className='flex-1 outline-none p-3 rounded-xl bg-transparent'
            />
            <IconButton>
                <SendIcon />
            </IconButton>
        </div>
        <div className='bg-white flex-1 mb-3 rounded-xl p-3'>
            <h1 className='font-semibold text-xl text-gray-400 w-full border-0 border-b-2'>
                Add members
            </h1>
            <div className='flex flex-col overflow-auto mt-1 mb-3'>
                <div className='flex justify-between items-center py-3'>
                    <div className='flex items-center gap-2'>
                        <AccountCircleIcon className='text-slate-400'/>
                        Name
                    </div>
                    <div>
                        <input type="checkbox" />
                    </div>
                </div>
                <div className='flex justify-between items-center py-3'>
                    <div className='flex items-center gap-2'>
                        <AccountCircleIcon className='text-slate-400'/>
                        Name
                    </div>
                    <div>
                        <input type="checkbox" />
                    </div>
                </div>
                <div className='flex justify-between items-center py-3'>
                    <div className='flex items-center gap-2'>
                        <AccountCircleIcon className='text-slate-400'/>
                        Name
                    </div>
                    <div>
                        <input type="checkbox" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateGroup
