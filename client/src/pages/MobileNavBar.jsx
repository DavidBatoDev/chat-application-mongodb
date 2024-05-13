import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import Conversations from '../components/Conversations'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Icon, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice/themeSlice';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const MobileNavBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {darkMode} = useSelector(state => state.theme)
    const [users, setUsers] = useState([])
    const mockUsers = [
      {
        name: 'John Doe',
        lastMessage: 'Hello, how are you?',
        timeStamp: 'today'
      },
      {
        name: 'Jane Doe',
        lastMessage: 'Hello, how are you?',
        timeStamp: 'yesterday'
      },
      {
        name: 'John Smith',
        lastMessage: 'Hello, how are you?',
        timeStamp: '2 days ago'
      },
      {
        name: 'Jane Smith',
        lastMessage: 'Hello, how are you?',
        timeStamp: '3 days ago'
      }
    ]
  
    useEffect(() => {
      setUsers(mockUsers)
    }, [])

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth > 768) {
          navigate('/app');
        }
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth, navigate]);

  return (
    <div className={`${darkMode && 'dark-secondary'} w-screen h-screen p-5 md:hidden flex flex-col`}>
       <div className={`flex ${darkMode && 'dark-primary'} bg-white p-3 rounded-xl`}>
        <nav className='w-full flex justify-between items-center'>
            <div className='flex items-center'>
                <IconButton>
                    <AccountCircleIcon className={`${darkMode && "text-slate-500"}`} />
                </IconButton>
                Name
            </div>
            <div className='flex items-center'>
              <IconButton onClick={() => navigate('/app/groups')}>
                    <PersonAddIcon 
                        className={`${darkMode && "text-slate-500"}`} />
                </IconButton>
                <IconButton onClick={() => navigate('/app/groups')}>
                    <GroupsIcon 
                        className={`${darkMode && "text-slate-500"}`} />
                </IconButton>
                <IconButton onClick={() => navigate('/app/create-group')}>
                    <AddCircleIcon
                        className={`${darkMode && "text-slate-500"}`} />
                </IconButton>
                <IconButton onClick={() => dispatch(toggleTheme())}>
                {
                    darkMode ? 
                    <WbSunnyIcon 
                        className='text-slate-500 text-6xl' /> 
                    :
                    <DarkModeIcon
                        className='text-slate-500 text-6xl' />
                }
                </IconButton>
            </div>
        </nav>
       </div>

       <div className='flex items-center gap-2 my-5'>
        <SearchIcon className={`${darkMode && "text-slate-500"}`} />
        <input type="text" placeholder='Search' className='w-full bg-transparent border-b-2 border-slate-500 focus:outline-none' />
       </div>

       <div className='flex-[1] flex flex-col overflow-auto' style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none' 
              }
            }}>
        <Conversations users={users} />
       </div>
    </div>
  )
}

export default MobileNavBar
