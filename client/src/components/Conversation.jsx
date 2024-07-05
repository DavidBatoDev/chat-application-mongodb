import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Conversation = ({ currentChat, convo, isHighlighted, onConversationClick }) => {
  const [isRead, setIsRead] = useState(false);
  const [latestMessage, setLatestMessage] = useState(convo?.latestMessage?.content);
  const { darkMode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.user);
  const isGroupChat = convo.isGroupChat;
  const { socket } = useSelector(state => state.socket);
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    socket.on('update message', message => {
      if (convo._id.toString() === message.chat._id.toString()) {
        setLatestMessage(message.content);
      }
    });

    return () => {
      socket.off('update message');
    };
  }, [convo._id, socket]);

  const chatName = !isGroupChat ? 
    convo.users.find(u => u._id !== user._id).name
    : convo.chatName;

  useEffect(() => {
    console.log(convo._id)

    if (currentChat == convo?._id) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [currentChat])

    // ${isActive ? darkMode && 'bg-slate-900' : ""}
    // ${isActive ? !darkMode && 'bg-slate-400' : ""}

  return (
    <div
      onClick={() => onConversationClick(convo._id)}
      className={`flex items-center md:px-5 py-3 gap-2 
        ${darkMode ? 'hover:bg-gray-800 active:bg-gray-600' : 'hover:bg-slate-300 active:bg-slate-100'} 
        cursor-pointer`}
    >
      <AccountCircleIcon className='text-slate-500' />
      <div>
        <h1 className={`${isHighlighted ? 'font-bold' : ''} text-md`}>{chatName}</h1>
        <p className={` ${isHighlighted ? 'font-bold' : ''} text-xs max-w-32 truncate text-slate-500`}>{latestMessage}</p>
      </div>
    </div>
  );
};

export default Conversation;
