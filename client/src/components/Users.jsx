import { useState, useEffect } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
    const {user} = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    const {darkMode} = useSelector(state => state.theme)

    // fetching public users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('authToken'))
                const res = await axios.get(`/api/user/fetchUsers?search=${search}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                
                })
                setUsers(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUsers()
    }, [search])

    // const handleFetchChat = async (userId) => {
    //     try {
    //         const token = JSON.parse(localStorage.getItem('authToken'))
    //         const res = await axios.get(`/api/chat/fetchChat/${userId}`,{
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //        const chatId = await res.data._id
    //         navigate(`/app/chat/${res.data._id}`)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-1 md:flex-[0.7] bg-slate-100 px-4`}>
        <div className='flex flex-col gap-1 mt-2 w-full h-full'>
            <div className={`${darkMode && 'dark-primary'} flex items-center w-full bg-white mt-3 py-2 rounded-xl`}>
                <div className='md:hidden'>
                    <IconButton onClick={() => navigate('/nav')}>
                    <KeyboardBackspaceIcon className='text-slate-500' />
                    </IconButton>
                </div>
                <h1 className='p-3 font-semibold'>
                    Add Users
                </h1>
            </div>
            <div>

            <div className='flex items-center gap-1 py-2 mt-2 px-3 rounded-xl border overflow-hidden'>
            <SearchIcon className='text-slate-500' />
            <input  
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
                placeholder='Search Users' 
                className='w-full bg-whit bg-transparent focus:outline-none' />
            </div>

        </div>
            <div className={`${darkMode && 'dark-primary'} bg-white flex-1 mb-3 rounded-xl p-3 pt-0`}>
                <div className='flex flex-col overflow-auto mt-1 mb-3'>
                    {users.length > 0 && users.map(user => (
                        <div onClick={() => navigate(`/app/user/${user._id}`)} key={user._id} className={`cursor-pointer flex items-center py-3 border-b-2 ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"} rounded-xl px-3`}>
                            <div className='flex items-center gap-2'>
                                <AccountCircleIcon className='text-slate-400'/>
                                {user.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    )
}

export default Users
