import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import MessageOthers from './MessageOthers';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MessageSelf from './MessageSelf';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'

const ChatArea = () => {
  const navigate = useNavigate()
  const {darkMode} = useSelector(state => state.theme)

  return (
    <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-[1] md:flex-[0.7] bg-slate-100 px-4`}>
      <div className={`${darkMode && 'dark-primary'} bg-white p-3 mt-5 rounded-xl flex justify-between shadow`}>
      <div className='flex items-center cursor-pointer'>
        <IconButton onClick={() => navigate('/nav')}>
          <KeyboardBackspaceIcon className='text-slate-500' />
        </IconButton>
        <AccountCircleIcon className='text-slate-500 mr-2' />
        <div className='flex flex-col'>
          <h1 className='font-semibold'>John Doe</h1>
          <p className='text-xs text-green-600'>online</p>
        </div>
      </div>
      <div>
        <IconButton>
          <MoreHorizIcon className='text-slate-500' />
        </IconButton>
      </div>
    </div>

    <div className={`${darkMode && 'dark-primary'} flex-1 bg-white mt-3 rounded-xl shadow px-3 overflow-auto`}>
      <div className='flex flex-col-reverse h-full'>
        <div style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none' 
              }
            }} className='overflow-y-auto flex  flex-col gap-1 px-3 py-5'>
            <MessageOthers />
            <MessageSelf />
            <MessageOthers />
            <MessageSelf />
            <MessageSelf />
            <MessageOthers />
            <MessageOthers />
        </div>
      </div>
    </div>

    <div className={`${darkMode && 'dark-primary'} flex items-center my-3 shadow p-3 rounded-xl overflow-hidden w-full bg-white`}>
      <textarea type="text" placeholder='Message...' 
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none' 
          }
        }}
        className={`bg-transparent flex-1 h-10 resize-none text-wrap py-3 outline-none overflow-visible`} />
      <IconButton>
        <SendIcon className='text-slate-500' />
      </IconButton>
    </div>
   </div>
  )
}

export default ChatArea
