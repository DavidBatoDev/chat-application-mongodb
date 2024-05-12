import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
    const navigate = useNavigate()
    const {darkMode} = useSelector(state => state.theme)
  return (
    <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-1 md:flex-[0.7] bg-slate-100 px-4`}>
    <div className='flex flex-col gap-2 mt-2 h-full w-full'>
        <div className={`${darkMode && 'dark-primary'} flex items-center w-full bg-white mt-3 rounded-xl py-2 shadow-sm`}>
            <div className='md:hidden'>
                <IconButton>
                    <KeyboardBackspaceIcon className='text-slate-500' onClick={() => navigate('/nav')}/>
                </IconButton>
            </div>
            <input 
                type="text" 
                placeholder='Enter Group Name..'
                className='flex-1 outline-none p-3 rounded-xl bg-transparent'
            />
            <IconButton>
                <AddIcon className='text-slate-500' />
            </IconButton>
        </div>
        <div className={`${darkMode && 'dark-primary'} bg-white flex-1 mb-3 rounded-xl p-3`}>
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
    </div>
  )
}

export default CreateGroup
