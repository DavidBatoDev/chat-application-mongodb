import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Conversation = ({ convo }) => {
  const [isRead, setIsRead] = useState(false);
  const [latestMessage, setLatestMessage] = useState(convo?.latestMessage?.content);
  const navigate = useNavigate();
  const { darkMode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.user);
  const isGroupChat = convo.isGroupChat;
  const {socket} = useSelector(state => state.socket);

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

  return (
    <div onClick={() => navigate(`/app/chat/${convo._id}`)} className={`flex items-center md:px-5 py-3 gap-2 ${darkMode ? 'hover:bg-gray-900 active:bg-gray-600' : 'hover:bg-slate-300 active:bg-slate-100'} cursor-pointer`}>
      <AccountCircleIcon className='text-slate-500' />
      <div>
        <h1 className={`${isRead ? '' : 'font-semibold'} text-md font-semibold`}>{chatName}</h1>
        <p className='text-xs max-w-32 truncate text-slate-500'>{latestMessage}</p>
      </div>
    </div>
  );
};

export default Conversation;
