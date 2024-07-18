import React, { useState, useEffect } from 'react';
import Conversations from './Conversations';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import { logout } from '../redux/userSlice/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const { darkMode } = useSelector(state => state.theme);
  const navigate = useNavigate();
  const [convos, setConvos] = useState([]);
  const [highlightedConvos, setHighlightedConvos] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const fetchUsersChat = async () => {
    if (!user) {
      navigate('/login');
    }
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const res = await axios.get('/api/chat', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setConvos(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUsersChat();
    localStorage.getItem('highlightedConvos') && setHighlightedConvos(JSON.parse(localStorage.getItem('highlightedConvos')));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('sort convo', (message) => {
      setConvos((prevConvos) => {
        const updatedConvos = prevConvos.map((convo) => {
          if (convo._id === message.chat._id) {
            return {
              ...convo,
              latestMessage: message,
              updatedAt: new Date().toISOString(),
            };
          }
          return convo;
        });

        updatedConvos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        return updatedConvos;
      });
    });

    socket.on('update message', (message) => {
      if (message.sender._id !== user._id && message.chat._id !== currentChat) {
        setHighlightedConvos(prevState => [...prevState, message.chat._id]);
        localStorage.setItem('highlightedConvos', JSON.stringify([...highlightedConvos, message.chat._id]));
      }
    });

    return () => {
      socket.off('sort convo');
      socket.off('update message');
    };
  }, [socket, user.name, currentChat]);

  const handleConversationClick = (convoId) => {
    setCurrentChat(convoId);
    setHighlightedConvos(prevState => prevState.filter(id => id !== convoId));
    navigate(`/app/chat/${convoId}`);
  };

  return (
    <div className={`hidden md:block h-full bg-slate-300 flex-[0.3] ${darkMode && 'dark-secondary'}`}>
      {/* nav */}
      <nav className={`${darkMode && 'dark-primary'} flex justify-between items-center my-5 mx-2 rounded-xl p-3 bg-white`}>
        <div onClick={() => navigate('/app/profile')} className='flex items-center'>
          <IconButton>
            <img src={user?.profilePic} alt="" 
            className='w-7 h-7 rounded-full object-cover'/>
          </IconButton>
          <p className='hidden font-semibold lg:flex cursor-pointer'>{user.name}</p>
        </div>
        <div className='flex items-center'>
          <IconButton onClick={() => navigate('users')}>
            <PersonAddIcon className='text-slate-500' />
          </IconButton>
          <IconButton onClick={() => navigate('groups')}>
            <GroupsIcon className='text-slate-500' />
          </IconButton>
          <IconButton onClick={() => navigate('create-group')}>
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
      <Conversations currentChat={currentChat} convos={convos} highlightedConvos={highlightedConvos} onConversationClick={handleConversationClick} />
    </div>
  );
};

export default Sidebar;
