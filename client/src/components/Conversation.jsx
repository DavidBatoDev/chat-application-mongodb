import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';

const Conversation = ({ currentChat, convo, isHighlighted, onConversationClick }) => {
  const [isRead, setIsRead] = useState(false);
  const [latestMessage, setLatestMessage] = useState(convo?.latestMessage?.content);
  const { darkMode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.user);
  const isGroupChat = convo.isGroupChat;
  const { socket } = useSelector(state => state.socket);
  const [isActive, setIsActive] = useState(false)
  const [profilePic, setProfilePic] = useState(null)

  useEffect(() => {
    if (!socket) return
    socket.on('update latest', message => {
      console.log('update latest', message.content);
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
    if (currentChat == convo?._id) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [currentChat])

    // ${isActive ? darkMode && 'bg-slate-900' : ""}
    // ${isActive ? !darkMode && 'bg-slate-400' : ""}

  useEffect(() => {
    if (!convo.isGroupChat) {
      const friend = convo.users.find(u => u._id !== user._id);
      setProfilePic(friend?.profilePic);
    }
  }, [])

  return (
    <div
      onClick={() => onConversationClick(convo._id)}
      className={`flex items-center md:px-5 py-3 gap-2 relative
        ${darkMode ? 'hover:bg-gray-800 active:bg-gray-600' : 'hover:bg-slate-300 active:bg-slate-100'} 
        cursor-pointer`}
    >
      <img 
        src={profilePic} alt="" 
        className='h-7 w-7 object-cover rounded-full'/>

      <div>
        <h1 className={`${isHighlighted ? 'font-bold' : ''} text-md`}>{chatName}</h1>
        <p className={` ${isHighlighted ? 'font-bold' : ''} text-xs max-w-32 truncate text-slate-500`}>{latestMessage}</p>
      </div>
      {isHighlighted && <div className='absolute top-7 right-5 h-3 w-3 bg-gray-500 rounded-full'></div>}
    </div>
  );
};

export default Conversation;
