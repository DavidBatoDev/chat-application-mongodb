import React, { useState, useEffect, useRef } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import MessageOthers from './MessageOthers';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MessageSelf from './MessageSelf';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Alert } from '@mui/material';
import { clearError, setError } from '../redux/errorSlice/errorSlice';

const ChatArea = () => {
  const dispatch = useDispatch();
  const [friendId, setFriendId] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const latestMessage = useRef(null);
  const [loading, setLoading] = useState(true);
  const [chatName, setChatName] = useState('');
  const [chatPic, setChatPic] = useState(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const { chatId } = useParams();
  const [prevChatId, setPrevChatId] = useState(chatId);
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const { darkMode } = useSelector(state => state.theme);
  const { message } = useSelector(state => state.error);
  const { socket } = useSelector(state => state.socket);
  const [disabledChat, setDisabledChat] = useState(false);

  // useEffect to fetch messages and chat info and listen for socket events
  useEffect(() => {
    if (!socket) return;

    // fetch messages and chat info
    const fetchMessages = async () => {
      try {
        setChatName('');
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('authToken'));
        const res = await axios.get(`/api/message/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages);
        if (res.data.chat.isGroupChat) {
          setChatName(res.data.chat.chatName);
          setChatPic(res.data.chat.chatImage);
          setIsGroupChat(true);
          setChatInfo(res.data.chat);
          setFriendId('');
        } else {
          const friend = res.data.chat.users.find(u => u._id !== user._id);
          setChatName(friend.name);
          setChatPic(friend?.profilePic);
          setIsGroupChat(false);
          setChatInfo(res.data.chat);
          setFriendId(friend._id);
          setIsOnline(friend.isOnline);
        }
        socket.emit('leave chat', prevChatId);
        setPrevChatId(chatId);
        socket.emit('join chat', chatId);
        setLoading(false);
      } catch (error) {
        dispatch(setError('Chat not found'));
      }
    };

    fetchMessages();

    // socket events
    const handleDisabledChat = chat => {
      if (chat._id === chatId) {
        setDisabledChat(true);
      }
    };
    const handleEnableChat = chat => {
      if (chat._id === chatId) {
        setDisabledChat(false);
      }
    };
    const handleMessageReceived = message => {
      setMessages(prevState => [...prevState, message]);
    };
    const handleUserOnline = userId => {
      if (userId === friendId) {
        setIsOnline(true);
      }
    };
    const handleUserOffline = userId => {
      if (userId === friendId) {
        setIsOnline(false);
      }
    };

    // listen for socket events
    socket.on('disabled chat', handleDisabledChat);
    socket.on('enable chat', handleEnableChat);
    socket.on('message received', handleMessageReceived);
    socket.on('user online', handleUserOnline);
    socket.on('user offline', handleUserOffline);

    // cleanup
    return () => {
      socket.emit('leave chat', chatId);
      socket.off('message received', handleMessageReceived);
      socket.off('disabled chat', handleDisabledChat);
      socket.off('enable chat', handleEnableChat);
      socket.off('user online', handleUserOnline);
      socket.off('user offline', handleUserOffline);
      setMessages([]);
      setChatName('');
      setChatPic(null);
      setIsGroupChat(false);
      setChatInfo(null);
      setIsOnline(false);
      setLoading(false);
      dispatch(clearError());
    };
  }, [chatId, friendId, socket, user._id, prevChatId, dispatch]);

  // for scrolling to the latest message
  useEffect(() => {
    latestMessage.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message functionality
  const handleSendMessage = async () => {
    try {
      if (isGroupChat) {
        const isMember = chatInfo?.users.find(u => u._id === user._id);
        if (!isMember) return dispatch(setError('You are not a member of this group'));
      }
      if (!text.trim()) return;
      const token = JSON.parse(localStorage.getItem('authToken'));
      const res = await axios.post(`/api/message`, {
        content: text,
        chatId: chatId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
      if (res.data?.success === false) {
        dispatch(setError(res.data.message));
        return;
      }
      socket.emit('new message', res.data);
    } catch (error) {
      dispatch(setError('Message not sent'));
    }
  };

  const handleViewChatProfile = () => {
    if (isGroupChat) {
      navigate(`/app/group-info/${chatId}`);
    } else {
      const friend = chatInfo.users.find(u => u._id !== user._id);
      navigate(`/app/user/${friend._id}`);
    }
  };

  return (
    <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-[1] md:flex-[0.7] bg-slate-100 px-4`}>
      {message && (
        <div className='z-20 fixed top-40 left-1/2 flex bg-red-50 pr-3'>
          <Alert className='transition-opacity' severity="error">{message}</Alert>
          <button onClick={() => dispatch(clearError())} className='text-red-300'>x</button>
        </div>
      )}
      <div className={`${darkMode && 'dark-primary'} bg-white p-3 mt-5 rounded-xl flex justify-between shadow`}>
        <div className='flex items-center cursor-pointer'>
          <div className='md:hidden'>
            <IconButton onClick={() => navigate('/nav')}>
              <KeyboardBackspaceIcon className='text-slate-500' />
            </IconButton>
          </div>
          <div className='flex items-center' onClick={handleViewChatProfile}>
            <img src={chatPic} alt="" className='h-7 w-7 object-cover rounded-full mr-2' />
            <div className='flex flex-col'>
              <h1 className='font-semibold'>{chatName}</h1>
              {isOnline && !isGroupChat && <p className='text-xs text-green-500'>online</p>}
              {!isOnline && !isGroupChat && <p className='text-xs text-gray-500'>offline</p>}
            </div>
          </div>
        </div>
        <div>
          <IconButton>
            <MoreHorizIcon className='text-slate-500' />
          </IconButton>
        </div>
      </div>

      <div className={`${darkMode && 'dark-primary'} relative flex-1 bg-white mt-3 rounded-xl shadow px-3 overflow-auto`}>
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <CircularProgress />
          </div>
        ) : (
          <div className='flex flex-col-reverse h-full'>
            <div style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }} className='overflow-y-auto flex flex-col gap-1 px-3 py-5'>
              {messages.map(message => (
                message.sender._id === user._id ? <MessageSelf key={message._id} message={message} /> : <MessageOthers key={message._id} message={message} />
              ))}
              <div ref={latestMessage} />
            </div>
          </div>
        )}
      </div>
      {
        disabledChat ? (
          <div className='flex justify-center items-center bg-red-100 text-red-500 p-5 mb-3 rounded-xl mt-3'>
            <p>You are not allowed to chat in this group</p>
          </div>
        ) : (
          <div className={`${darkMode && 'dark-primary'} flex items-center my-3 shadow p-3 rounded-xl overflow-hidden w-full bg-white`}>
            <textarea
              type="text"
              disabled={disabledChat}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder='Message...'
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
              className={`bg-transparent flex-1 h-10 resize-none text-wrap py-3 outline-none overflow-visible`}
            />
            <IconButton disabled={loading || disabledChat} onClick={handleSendMessage}>
              <SendIcon className='text-slate-500' />
            </IconButton>
          </div>
        )
      }
    </div>
  );
};

export default ChatArea;
