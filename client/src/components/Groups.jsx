import React, {useState, useEffect} from 'react'
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Groups = () => {
    const navigate = useNavigate()
    const {darkMode} = useSelector(state => state.theme)
    const [groups, setGroups] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchGroups = async () => {
            const token = JSON.parse(localStorage.getItem("authToken") || null)
            if (!token) return
            const res = await axios.get(`/api/user/fetchGroups?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGroups(res.data)
        }
        fetchGroups()
    }, [search])

    const handleJoinGroup = async (groupId) => {
        try {
            const token = JSON.parse(localStorage.getItem("authToken") || null)
            const res = await axios.get(`/api/chat/joinGroup/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigate(`/app/chat/${groupId}`)

        } catch (error) {
            console.log(error.response.data)
        }
    }
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
                        Join Public Groups
                    </h1>
                </div>
                <div>
                    <div className='flex items-center gap-1 py-2 mt-2 px-3 rounded-xl border overflow-hidden'>
                    <SearchIcon className='text-slate-500' />
                    <input 
                        type="text" 
                        placeholder='Search Groups' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='w-full bg-whit bg-transparent focus:outline-none' />
                </div>
            </div>
            <div className={`${darkMode && 'dark-primary'} bg-white flex-1 mb-3 rounded-xl p-3 pt-0`}>
                    <div className='flex flex-col overflow-auto mt-1 mb-3'>
                        {groups.map(group => (
                            <div 
                                onClick={() => handleJoinGroup(group._id)} 
                                className={`flex items-center py-3 border-b-2 cursor-pointer ${darkMode ? "hover:bg-slate-700" : "hover:bg-slate-200"}  rounded-xl px-3`} 
                                key={group._id}>
                                <div className='flex items-center gap-2'>
                                    <GroupsIcon className='text-slate-500' />
                                    {group.chatName}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Groups
