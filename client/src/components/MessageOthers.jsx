import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';

const MessageOthers = ({message}) => {
  const {darkMode} = useSelector(state => state.theme)

  const modifiedTime = () => {
    // if more than 1 day show date plus time
    if (new Date().getDate() - new Date(message.createdAt).getDate() > 0) {
      return new Date(message.createdAt).toLocaleString([], {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    } else {
      return new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  console.log(message.sender)

  return (
    <div className={`flex items-center my-3 w-full`}>
        <div className={`flex flex-row items-center`}>
        <IconButton>
          <img 
            src={message.sender?.profilePic}
            className='w-10 h-10 rounded-full border'
            alt="" />
        </IconButton>
        <div className={`${darkMode && 'dark-secondary'} flex flex-col bg-slate-300 p-2 rounded-xl  min-w-56 max-w-40 md:max-w-72 lg:max-w-96`}>
            <h1 className='font-semibold'>
              {message.sender.name}
            </h1>
            <p className={`text-sm text-wrap break-words`}>
              {message.content}
            </p>
            <span className='flex justify-end text-xs text-gray-400'>
              {modifiedTime()}
            </span>
        </div>
        </div>
    </div>
  )
}

export default MessageOthers
