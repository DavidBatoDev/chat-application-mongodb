import React, { useState, useEffect } from 'react'
import './App.css'
import MainContainer from './components/MainContainer'
import Login from './pages/Login'
import Register from './pages/Register'
import Theme from './components/Theme'
import ProtectedRoute from './components/ProtectedRoute'
import NoConvoOpen from './components/NoConvoOpen'
import CreateGroup from './components/CreateGroup'
import Profile from './components/Profile'
import Users from './components/Users'
import ChatArea from './components/ChatArea'
import Groups from './components/Groups'
import MobileNavBar from './pages/MobileNavBar'
import EditProfile from './components/EditProfile'
import User from './components/User'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { 
  initializeSocket,
  disconnectSocket
 } from './redux/socketSlice/socketSlice'

const App = () => {
  const dispatch = useDispatch()
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false)
  const { user } = useSelector(state => state.user)
  const { darkMode } = useSelector(state => state.theme)
  const {socket} = useSelector(state => state.socket)
  
  // socket connection (initialization)
  useEffect(() => {
    dispatch(initializeSocket('http://localhost:5000'))
    return () => {
      dispatch(disconnectSocket())
    }
  }, [])

    // socket connection (setup)
  useEffect(() => {
    if (!user || !socket) return
    socket.emit('setup', {data: user})
    socket.on('connection', () => {
      setSocketConnectionStatus(!socketConnectionStatus)
    })

    socket.on('connected', () => {
      setSocketConnectionStatus(true)
    })

    socket.on('disconnect', () => {
      setSocketConnectionStatus(false)
    })

    return () => {
      socket.off('connection')
      socket.off('connected')
      socket.off('disconnect')
    }
  }, [socket, user])

  return (
    <BrowserRouter>
      <div className={`${darkMode && 'dark-primary'} relative bg-slate-200 h-screen w-screen flex justify-center items-center`}>
        <Theme /> 

        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/nav' element={<MobileNavBar />}/>
            <Route path='app/*' element={<MainContainer />}>
              <Route path='' element={<NoConvoOpen />}/>
              <Route path='chat/:chatId' element={<ChatArea />}/>
              <Route path='chat-info/:chatId' element={<ChatArea />}/>
              <Route path='no-convo' element={<NoConvoOpen />}/>
              <Route path='create-group' element={<CreateGroup />}/>
              <Route path='users' element={<Users />}/>
              <Route path='groups' element={<Groups />}/>
              <Route path='profile' element={<Profile />} />
              <Route path='user/:userId' element={<User />}/>
              <Route path='edit-profile' element={<EditProfile />} />
              <Route path='*' element={<NoConvoOpen />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
