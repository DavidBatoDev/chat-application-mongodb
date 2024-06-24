import React, { useState, useEffect } from 'react'
import './App.css'
import MainContainer from './components/MainContainer'
import Login from './pages/Login'
import Register from './pages/Register'
import Theme from './components/Theme'
import ProtectedRoute from './components/ProtectedRoute'
import NoConvoOpen from './components/NoConvoOpen'
import CreateGroup from './components/CreateGroup'
import Users from './components/Users'
import ChatArea from './components/ChatArea'
import Groups from './components/Groups'
import MobileNavBar from './pages/MobileNavBar'
import User from './components/User'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const { darkMode } = useSelector(state => state.theme)

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
              <Route path='no-convo' element={<NoConvoOpen />}/>
              <Route path='create-group' element={<CreateGroup />}/>
              <Route path='users' element={<Users />}/>
              <Route path='groups' element={<Groups />}/>
              <Route path='user' element={<User />} />
              <Route path='*' element={<NoConvoOpen />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
