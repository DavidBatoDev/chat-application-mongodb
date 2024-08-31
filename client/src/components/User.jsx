import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LinkIcon from '@mui/icons-material/Link';
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ChatIcon from '@mui/icons-material/Chat';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const User = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.user)
    const {userId} = useParams()
    const {darkMode} = useSelector(state => state.theme)
    const [userInfo, setUserInfo] = useState(null)
    const {socket} = useSelector(state => state.socket)

    const fetchUserInfo = async () => {
        try {
            const res = await axios.get(`/api/user/fetch-other-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken'))}`
                }
            })
            if (res.status !== 200) {
                console.error('Error fetching user info:', res.data.message);
            }
            setUserInfo(res.data)
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleFetchChat = async (userId) => {
        try {
            const token = JSON.parse(localStorage.getItem('authToken'))
            const res = await axios.get(`/api/chat/fetchChat/${userId}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            navigate(`/app/chat/${res.data.chat._id}`)
            if (res.data.isNewChat) {
                socket.emit('new chat', res.data.chat)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [userId])


  return (
   <div className={`${darkMode && 'dark-theme'} flex flex-col h-full md:flex-[0.7] flex-1 bg-slate-100 px-4`}>
        <div className={`${darkMode && 'dark-primary'} h-full mb-3 bg-white p-4 mt-5 rounded-xl flex justify-between shadow overflow-y-scroll custom-scrollbar`}>
            <div className='fixed'>
              <IconButton onClick={() => navigate(-1)}>
                <KeyboardBackspaceIcon className='text-slate-500' />
              </IconButton>
            </div>
            <div className=' flex flex-col items-center w-full gap-5 md:px-2 lg:px-10 pb-40'>
                <div className={`${darkMode && 'dark-secondary'} bg-slate-200 relative rounded-full mt-12 w-32 h-32`}>
                    <img 
                        src={userInfo?.profilePic}
                        alt="Profile" 
                        className='w-32 h-32 object-cover rounded-full cursor-pointer'/>
                </div>
                <div className={`
                    ${darkMode && 'dark-secondary'} bg-slate-200 w-full rounded-xl h-46 flex justify-between items-center gap-3 p-3
                `}>
                    <div>
                        <h1 className='text-2xl font-semibold'>{userInfo?.name}</h1>
                        <small>{userInfo?.email}</small>
                    </div>
                    <div>
                        <IconButton onClick={() => handleFetchChat(userInfo._id)}>
                            <ChatIcon className='text-gray-300'/>
                        </IconButton>
                    </div>
                </div>

                <div className={`
                   ${darkMode && 'dark-secondary'} bg-slate-200 w-full rounded-xl flex p-3 flex-col gap-5
                `}>
                    {userInfo?.aboutMe && (
                        <div>
                            <p className='font-semibold'>About {userInfo?.name}</p>
                            <p>{userInfo?.aboutMe}</p>
                        </div>
                    )}
                    <div>
                        <p className='font-semibold'>User since</p>
                        <p>{user?.createdAt.split("T")[0]}</p>
                    </div>
                    {userInfo?.socials.length > 0 && (
                    <div>
                        <p className='font-semibold'>Socials</p>
                        <div className='flex flex-col mt-2 gap-2'>
                            {userInfo?.socials.map((social, index) => (
                                <div key={index} className='flex gap-2'>
                                    {social.social === 'instagram' && <InstagramIcon />}
                                    {social.social === 'facebook' && <FacebookIcon />}
                                    {social.social === 'twitter' && <XIcon />}
                                    {social.social === 'link' && <LinkIcon />}
                                    <span>{social.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default User
