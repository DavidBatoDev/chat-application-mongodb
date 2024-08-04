import React, {useState, useEffect} from 'react'
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
    startLoading,
    stopLoading,
    setError,
    clearError
} from '../redux/errorSlice/errorSlice';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';

const Groups = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {darkMode} = useSelector(state => state.theme)
    const {message, loading} = useSelector(state => state.error)
    const [groups, setGroups] = useState([])
    const [search, setSearch] = useState('')

    const fetchGroups = async () => {
        try {
            dispatch(clearError())
            if (!search) {
                setGroups([])
                return
            }
            const token = JSON.parse(localStorage.getItem("authToken") || null)
            if (!token) return
            const res = await axios.get(`/api/user/fetchGroups?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setGroups(res.data)
            console.log(res.data)
        }
        catch (error) {
            console.log(error)
        }

    }
    
    useEffect(() => {
        dispatch(clearError())
        fetchGroups()
    }, [search])

    const handleJoinGroup = async (groupId) => {
        try {
            dispatch(clearError())
            dispatch(startLoading())
            const token = JSON.parse(localStorage.getItem("authToken") || null)
            const res = await axios.get(`/api/chat/joinGroup/${groupId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data)
            if (!res.data.success) {
                dispatch(stopLoading())
                dispatch(setError(res.data.message))
                return
            }
            dispatch(stopLoading())
            navigate(`/app/chat/${groupId}`)
        } catch (error) {
            dispatch(stopLoading())
            console.log(error.response.data.message)
            dispatch(setError(error.response.data.message))
        }
    }
    return (
        <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-1 md:flex-[0.7] bg-slate-100 px-4`}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
            {message && (
                <div className='fixed top-10 flex bg-red-50 pr-3'>
                <Alert className='transition-opacity' severity="error">{message}</Alert>
                <button onClick={() => dispatch(clearError())} className='text-red-300'>x</button>
                </div>
            )}
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
