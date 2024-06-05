import React, { useState, useEffect } from 'react'
import Conversations from './Conversations';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import {logout} from '../redux/userSlice/userSlice'
import { useDispatch } from 'react-redux';
import axios from 'axios'

const Sidebar = () => {
  const dispatch = useDispatch()
  const {darkMode} = useSelector(state => state.theme)
  const navigate = useNavigate()
  const [convos, setConvos] = useState([])

  useEffect(() => {
    const fetchUsersChat = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('authToken'))
        const res = await axios.get('/api/chat', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setConvos(res.data)
      } catch (error) {
        console.log(error.response.data)
      }
    }
    fetchUsersChat()
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    navigate('/login')
  }

  return (
    <div className={`hidden md:block h-full bg-slate-300 flex-[0.3] ${darkMode && 'dark-secondary'}`}>
      {/* nav */}
      <nav className={`${darkMode && 'dark-primary'} flex justify-between my-5 mx-3 rounded-xl p-3 bg-white`}>
        <div onClick={handleLogout}>
          <IconButton>
            <AccountCircleIcon className='text-slate-500' />
          </IconButton>
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
      <Conversations convos={convos} />
    </div>
  )
}

export default Sidebar
