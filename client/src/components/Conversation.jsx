import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';

const Conversation = ({ currentChat, convo, isHighlighted, onConversationClick }) => {
  const { darkMode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.user);
  const isGroupChat = convo.isGroupChat;
  const { socket } = useSelector(state => state.socket);
  const friendId = convo.users.find(u => u._id !== user._id)?._id;
  const [isActive, setIsActive] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleUpdateLatest = message => {
      if (convo._id.toString() === message.chat._id.toString()) {
        convo.latestMessage = message;
      }
    };

    const handleUserOnline = userId => {
      console.log('user online', userId);
      console.log('friendId', friendId);
      if (userId === friendId) {
        setIsOnline(true);
      }
    };
    const handleUserOffline = userId => {
      console.log('user offline', userId);
      console.log('friendId', friendId);
      if (userId === friendId) {
        setIsOnline(false);
      }
    };

    socket.on('user online', handleUserOnline);
    socket.on('user offline', handleUserOffline);
    socket.on('update message', handleUpdateLatest);

    return () => {
      socket.off('update message');
      socket.off('user online', handleUserOnline);
      socket.off('user offline', handleUserOffline);
    };
  }, [convo._id, socket]);

  const chatName = !isGroupChat ? 
    convo.users.find(u => u._id !== user._id).name
    : convo.chatName;

  useEffect(() => {
    setIsActive(currentChat === convo._id);
  }, [currentChat, convo._id]);

  useEffect(() => {
    if (!convo.isGroupChat) {
      const friend = convo.users.find(u => u._id !== user._id);
      setProfilePic(friend?.profilePic);
      setIsOnline(friend?.isOnline);
    } else {
      setProfilePic(convo?.chatImage);
    }
  }, [convo]);

  return (
    <div
      onClick={() => onConversationClick(convo._id)}
      className={`flex items-center sm:px-5 py-3 gap-2 relative
        ${darkMode ? 'hover:bg-gray-800 active:bg-gray-600' : 'hover:bg-slate-300 active:bg-slate-100'} 
        cursor-pointer`}
    >
      <div className='relative h-7 w-7 '>
        <img 
          src={profilePic} alt="" 
          className='h-full w-full object-cover rounded-full'/>
        {isOnline && !isGroupChat && <div className='absolute right-0 bottom-0 bg-green-500 w-3 h-3 rounded-full'></div>}
      </div>

      <div>
        <h1 className={`${isHighlighted ? 'font-bold' : ''} text-md`}>{chatName}</h1>
        <p className={` ${isHighlighted ? 'font-bold' : ''} text-xs max-w-32 truncate text-slate-500`}>{convo?.latestMessage?.content}</p>
      </div>
      {isHighlighted && <div className='absolute top-7 right-5 h-3 w-3 bg-gray-500 rounded-full'></div>}
    </div>
  );
};

export default Conversation;
