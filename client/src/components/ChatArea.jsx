import React, {useState, useEffect, useRef} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import MessageOthers from './MessageOthers';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MessageSelf from './MessageSelf';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert'
import { clearError, setError } from '../redux/errorSlice/errorSlice'
import { useDispatch } from 'react-redux'

const ChatArea = ({socket}) => {
  const dispatch = useDispatch()
  const latestMessage = useRef(null)
  const [loading, setLoading] = useState(true)
  const [chatName, setChatName] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()
  const {user} = useSelector(state => state.user)
  const {darkMode} = useSelector(state => state.theme)
  const {errorMsg} = useSelector(state => state.error)
  const {chatId} = useParams()
  const [test, setTest] = useState(true)

  
  // scroll to latest message
  useEffect(() => {
    latestMessage.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // socket message received
  useEffect(() => {
    socket.on('message received', (message) => {
      console.log('message received')
      if (message.chat._id.toString() !== chatId.toString()) return
      setMessages(prevState => [...prevState, message])
    })
    return () => {
      socket.off('message received')
    }
  }, [chatId, socket])

  // fetch messages and socket join chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setChatName('')
        setLoading(true)
        const token = JSON.parse(localStorage.getItem('authToken'))
        const res = await axios.get(`/api/message/${chatId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setMessages(res.data.messages)
        if (res.data.chat.isGroupChat) {
          setChatName(res.data.chat.chatName)
        } else {
          const friendName = res.data.chat.users.find(u => u._id !== user._id)
          setChatName(friendName.name)
        }
        setLoading(false)
        socket.emit('join chat', chatId)
      } catch (error) {
        dispatch(setError(error.response.data))
    }}
    fetchMessages()
  }, [chatId, user._id])
  
  // socket new message
  const handleSendMessage = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('authToken'))
      const res = await axios.post(`/api/message`, {
        content: text,
        chatId: chatId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setText('')
      if (res.data?.success == false) {
        dispatch(setError(res.data.errorMsg))
        return
      }
      setMessages([...messages, res.data])
      socket.emit('new message', res.data)
    } catch (error) {
      dispatch(setError("Message not sent"))
    }
  }


  return (
    <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-[1] md:flex-[0.7] bg-slate-100 px-4`}>
        <div className={`${darkMode && 'dark-primary'} bg-white p-3 mt-5 rounded-xl flex justify-between shadow`}>
          <div className='flex items-center cursor-pointer'>
            <div className='md:hidden'>
              <IconButton onClick={() => navigate('/nav')}>
                <KeyboardBackspaceIcon className='text-slate-500' />
              </IconButton>
            </div>
            <AccountCircleIcon className='text-slate-500 mr-2' />
            <div className='flex flex-col'>
              <h1 className='font-semibold'>{chatName}</h1>
              <p className='text-xs text-green-600'>online</p>
            </div>
          </div>
          <div>
            <IconButton>
              <MoreHorizIcon className='text-slate-500' />
            </IconButton>
          </div>
        </div>

        <div className={`${darkMode && 'dark-primary'} relative flex-1 bg-white mt-3 rounded-xl shadow px-3 overflow-auto`}>
          {errorMsg && (
          <div className='z-20 fixed top-40 left-1/2 flex bg-red-50 pr-3'>
            <Alert className='transition-opacity' severity="error">{errorMsg}</Alert>
            <button onClick={() => dispatch(clearError())} className='text-red-300'>x</button>
          </div>
          )}
          {loading ? 
            (
            <div className='flex justify-center items-center h-full'>
            <CircularProgress />
            </div>
            ) :
            (
            <div className='flex flex-col-reverse h-full'>
              <div style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none' 
                    }
                  }} className='overflow-y-auto flex flex-col gap-1 px-3 py-5'>
                  {messages.map(message => {
                    return message.sender._id === user._id ? <MessageSelf key={message._id} message={message} /> : <MessageOthers key={message._id} message={message} />
                  })}
                  <div ref={latestMessage} />
              </div>
            </div>
            )
          }
        </div>

        <div className={`${darkMode && 'dark-primary'} flex items-center my-3 shadow p-3 rounded-xl overflow-hidden w-full bg-white`}>
          <textarea 
            type="text"
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
            className={`bg-transparent flex-1 h-10 resize-none text-wrap py-3 outline-none overflow-visible`} />
          
          <IconButton disabled={loading} onClick={handleSendMessage}>
            <SendIcon className='text-slate-500' />
          </IconButton>
        </div>
   </div>
  )
}

export default ChatArea
