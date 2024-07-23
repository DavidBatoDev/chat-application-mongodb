import {useState, useEffect} from 'react'
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateGroup = () => {
    const navigate = useNavigate()
    const {darkMode} = useSelector(state => state.theme)
    const [groupName, setGroupName] = useState('')
    const [users, setUsers] = useState([])
    const [usersToBeAdded, setUsersToBeAdded] = useState([])
    const {socket} = useSelector(state => state.socket)
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('authToken'))
                const res = await axios.get(`/api/user/fetchRelatedUsers`, {
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

        return () => {
            setUsers([])
        }
    }, [])

    const handleSelectUser = (userId, checkbox) => {
        if (checkbox.checked) {
            setUsersToBeAdded([...usersToBeAdded, userId])
        } else {
            setUsersToBeAdded(usersToBeAdded.filter(user => user !== userId))
        }
    }

    const handleCreateGroup = async (e) => {
        e.preventDefault()
        try {
            const token = JSON.parse(localStorage.getItem('authToken'))
            const res = await axios.post('/api/chat/createGroup', {groupName, usersToBeAdded}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success == false) return console.log(res.data.response.message)
            navigate(`/app/chat/${res.data._id}`)
            socket.emit('new chat', res.data)
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    return (
        <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-1 md:flex-[0.7] bg-slate-100 px-4`}>
        <form onSubmit={handleCreateGroup} className='flex flex-col gap-2 mt-2 h-full w-full'>
            <div className={`${darkMode && 'dark-primary'} flex items-center w-full bg-white mt-3 rounded-xl py-2 shadow-sm`}>
                <div className='md:hidden'>
                    <IconButton>
                        <KeyboardBackspaceIcon className='text-slate-500' onClick={() => navigate('/nav')}/>
                    </IconButton>
                </div>
                <input 
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder='Enter Group Name..'
                    className='flex-1 outline-none p-3 rounded-xl bg-transparent'
                />
                <IconButton type='submit'>
                    <AddIcon className='text-slate-500' />
                </IconButton>
            </div>
            <div className={`${darkMode && 'dark-primary'} bg-white flex-1 mb-3 rounded-xl p-3`}>
                <h1 className='font-semibold text-xl text-gray-400 w-full border-0 border-b-2'>
                    Add members
                </h1>
                <div className='flex flex-col overflow-auto mt-1 mb-3'>
                    {users.map(user => (
                        <div key={user._id} className='flex justify-between items-center py-3'>
                            <div className='flex items-center gap-2'>
                                <AccountCircleIcon className='text-slate-400'/>
                                {user.name}
                            </div>
                            <div>
                                <input 
                                    type="checkbox"
                                    className='cursor-pointer rounded-full h-4 w-4'
                                    onClick={(e) => handleSelectUser(user._id, e.target)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </form>
        </div>
    )
}

export default CreateGroup
