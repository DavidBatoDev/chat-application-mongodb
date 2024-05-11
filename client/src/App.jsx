import React, { useState } from 'react'
import './App.css'
import MainContainer from './components/MainContainer'
import Login from './pages/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import NoConvoOpen from './components/NoConvoOpen'
import CreateGroup from './components/CreateGroup'
import Users from './components/Users'
import ChatArea from './components/ChatArea'
import Groups from './components/Groups'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import {IconButton } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from './redux/themeSlice/themeSlice'

const App = () => {
  const dispatch = useDispatch()
  const { darkMode } = useSelector(state => state.theme)

  return (
    <BrowserRouter>
      <div className={`${darkMode && 'dark-primary'} relative bg-slate-200 h-screen w-screen flex justify-center items-center`}>
        <div className='fixed top-1 right-5'>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {
            darkMode ? 
              <WbSunnyIcon className='text-slate-500 text-6xl' /> 
              :
              <DarkModeIcon className='text-slate-500 text-6xl' />
            }
          </IconButton>        
        </div>
        <Routes>
        <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='app' element={<MainContainer />}>
            <Route path='chat' element={<ChatArea />}/>
            <Route path='' element={<NoConvoOpen />}/>
            <Route path='no-convo' element={<NoConvoOpen />}/>
            <Route path='create-group' element={<CreateGroup />}/>
            <Route path='users' element={<Users />}/>
            <Route path='groups' element={<Groups />}/>
            <Route path='*' element={<NoConvoOpen />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
