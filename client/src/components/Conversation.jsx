import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Conversation = ({convo}) => {
  const navigate = useNavigate()
  const {darkMode} = useSelector(state => state.theme)
  const {user} = useSelector(state => state.user)

  const isGroupChat = convo.isGroupChat

  const chatName = !isGroupChat ? 
    convo.users.find(u => u._id !== user._id).name
    : convo.chatName

  return (
    <div onClick={() => navigate(`/app/chat/${convo._id}`)} className={`flex items-center md:px-5 py-3 gap-2 ${darkMode ? 'hover:bg-gray-900 active:bg-gray-600' : 'hover:bg-slate-300 active:bg-slate-600' }  cursor-pointer`}>
        <AccountCircleIcon className='text-slate-500' />
        <div>
            <h1 className='text-md font-semibold'>{chatName}</h1>
            <p className='text-xs text-slate-500'>{convo?.latestMessage?.content}</p>
        </div>
    </div>
  )
}

export default Conversation
