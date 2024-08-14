import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    setError,
    clearError,
    stopLoading,
    startLoading
} from '../redux/errorSlice/errorSlice';
import { Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Backdrop } from '@mui/material';


const GroupInfo = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.user)
    const {message, loading} = useSelector(state => state.error)
    const {chatId} = useParams()
    const {darkMode} = useSelector(state => state.theme)
    const {socket} = useSelector(state => state.socket)
    const [chatInfo, setChatInfo] = useState(null)

    const fetchChat = async (chatId) => {
        try {
            dispatch(startLoading());
            const token = JSON.parse(localStorage.getItem('authToken'));
            const res = await axios.get(`/api/chat/fetchChatById/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(stopLoading());
            setChatInfo(res.data);
        } catch (error) {
            dispatch(stopLoading());
            dispatch(setError(error.response.data.message));
        }
    };

    const handleLeftGroup = async () => {
        try {
            dispatch(clearError());
            dispatch(startLoading());
            const token = JSON.parse(localStorage.getItem('authToken'));
            const res = await axios.get(`/api/chat/leftGroup/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(res)
            dispatch(stopLoading());
            if (res.status === 200) {
                socket.emit('leave group', res.data);
                socket.emit('new message', res.data.message);
                navigate('/app/groups');
                return
            }
            console.log(res.data);
        } catch (error) {
            dispatch(stopLoading());
            dispatch(setError(error.response.data.message));
        }
    };

    const handleDeleteGroup = async () => {
        try {
            dispatch(startLoading());
            const token = JSON.parse(localStorage.getItem('authToken'));
            const res = await axios.delete(`/api/chat/delete-group/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(stopLoading());
            navigate('/app/groups');
            socket.emit('delete chat', res.data.chat);
        } catch (error) {
            dispatch(stopLoading());
            console,log(error)
            dispatch(setError(error.response.data.message));
        }
    };

    useEffect(() => {
        dispatch(clearError())
        if (!user) return
        fetchChat(chatId)
        return () => {
            setChatInfo(null)
            dispatch(clearError())
            dispatch(stopLoading())
        }
    }, [chatId])

    const goToChat = () => {
        navigate(`/app/chat/${chatId}`)
    }
        

  return (
   <div className={`${darkMode && 'dark-theme'} flex flex-col h-full md:flex-[0.7] flex-1 bg-slate-100 px-4`}>
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
        
        <div className={`${darkMode && 'dark-primary'} h-full mb-3 bg-white p-4 mt-5 rounded-xl flex justify-between shadow overflow-y-scroll custom-scrollbar`}>
            <div className='absolute'>
              <IconButton onClick={() => navigate(-1)}>
                <KeyboardBackspaceIcon className='text-slate-500' />
              </IconButton>
            </div>
            <div className=' flex flex-col items-center w-full gap-5 md:px-2 lg:px-10 pb-40'>
                <div className={`relative dark-secondary rounded-full mt-12 w-32 h-32`}>
                    <img 
                        src={chatInfo?.chatImage}
                        alt="Profile" 
                        className='w-32 h-32 object-cover rounded-full cursor-pointer'/>
                </div>
                <div className={`
                    dark-secondary w-full rounded-xl h-46 flex justify-between items-center gap-3 p-3
                `}>
                    <div>
                        <h1 className='text-2xl font-semibold'>{chatInfo?.chatName}</h1>
                    </div>
                    <div>
                        <IconButton onClick={() => goToChat()}>
                            <ChatIcon className='text-gray-300'/>
                        </IconButton>
                    </div>
                </div>
                {chatInfo?.groupAdmin._id === user._id && (
                    <div className='flex items-center w-full gap-2'>
                        <button 
                            onClick={() => navigate(`/app/edit-group/${chatId}`)}
                            className='flex-1 text-lg dark-secondary rounded-full px-3 py-2 w-full '>
                            Edit Group
                        </button>
                        <button className='w-10 h-10 rounded-full dark-secondary'>
                            i
                        </button>
                    </div>
                    )
                }

                <div className={`
                    dark-secondary w-full rounded-xl flex p-3 flex-col gap-5
                `}>
                    <div>
                        <p className='font-semibold'>Group Admin:</p>
                        <p>{chatInfo?.groupAdmin.name}</p>
                    </div>
                    <div>
                        <p className='font-semibold'>Created at:</p>
                        <p>{chatInfo?.createdAt.split("T")[0]}</p>
                    </div>
                    <div>
                        <p className='font-semibold'>Members:</p>
                        <ul className='flex flex-col mt-2 gap-2'>
                            {chatInfo?.users.map((user, index) => (
                                <li key={index} className='flex gap-2'>
                                    - {user?.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='dark-secondary flex items-center gap-3 h-16 w-full p-5 rounded-xl mb-5'>
                    {
                        chatInfo?.groupAdmin._id === user._id ? (
                            <>
                            <button className='md:text-lg h-10 dark-primary rounded-full px-3 w-full text-sm'>Add Member</button>
                            <button 
                                onClick={handleDeleteGroup}
                                className='md:text-lg rounded-full h-10 px-3 w-full bg-red-400 text-sm'>Delete Group</button>
                            </>
                        ) : (
                            <button 
                                onClick={handleLeftGroup}
                                className='md:text-lg rounded-full h-10 px-3 w-full bg-red-400 text-sm'>Leave Group</button>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default GroupInfo
