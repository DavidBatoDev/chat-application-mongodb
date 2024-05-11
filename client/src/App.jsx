import React from 'react'
import './App.css'
import MainContainer from './components/MainContainer'
import Login from './pages/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import NoConvoOpen from './components/NoConvoOpen'
import CreateGroup from './components/CreateGroup'
import Users from './components/Users'
import ChatArea from './components/ChatArea'
import Groups from './components/Groups'

const App = () => {
  return (
    <BrowserRouter>
      <div className='bg-slate-200 h-screen w-screen flex justify-center items-center'>
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
