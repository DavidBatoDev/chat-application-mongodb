import {useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LinkIcon from '@mui/icons-material/Link';
import { useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice/userSlice'
import { IconButton } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const Profile = () => {
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.user)
    const [editMode, setEditMode] = useState(false)
    const navigate = useNavigate()
    const {darkMode} = useSelector(state => state.theme)

    const fetchUserInfo = async () => {
        try {
            console.log('Fetching user info...');
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const logoutUser = async () => {
        try {
            dispatch(logout())
            localStorage.removeItem('authToken')
        } catch (error) {
            console.error('Error logging out user:', error);
        }
    }

  return (
   <div className={`${darkMode && 'dark-theme'} flex flex-col h-full md:flex-[0.7] flex-1 bg-slate-100 px-4`}>
        <div className={`${darkMode && 'dark-primary'} h-full mb-3 bg-white p-4 mt-5 rounded-xl flex justify-between shadow overflow-y-scroll custom-scrollbar`}>
            <div className='md:hidden fixed'>
              <IconButton onClick={() => navigate('/nav')}>
                <KeyboardBackspaceIcon className='text-slate-500' />
              </IconButton>
            </div>
            <div className=' flex flex-col items-center w-full gap-5 md:px-2 lg:px-10 pb-40'>
                <div className={`relative dark-secondary rounded-full mt-12 w-32 h-32`}>
                    <img 
                        src={user?.profilePic}
                        alt="Profile" 
                        className='w-32 h-32 object-cover rounded-full cursor-pointer'/>
                </div>
                <div className={`
                    dark-secondary w-full rounded-xl h-46 flex flex-col gap-3 p-3
                `}>
                    <div>
                        <h1 className='text-2xl font-semibold'>{user?.name}</h1>
                        <small>{user?.email}</small>
                    </div>
                    <div className='flex gap-2'>
                        <button className='text-lg dark-primary rounded-full px-3 py-2 w-full '>Add Status</button>
                        <button 
                            onClick={() => navigate('/app/edit-profile')}
                            className='text-lg dark-primary rounded-full px-3 py-2 w-full '>
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className={`
                    dark-secondary w-full rounded-xl flex p-3 flex-col gap-5
                `}>
                    <div>
                        <p className='font-semibold'>About Me</p>
                        <p>{user?.aboutMe}</p>
                    </div>
                    <div>
                        <p className='font-semibold'>User since</p>
                        <p>{user?.createdAt.split("T")[0]}</p>
                    </div>
                    <div>
                        <p className='font-semibold'>Socials</p>
                        <div className='flex flex-col mt-2 gap-2'>
                            {user?.socials.map((social, index) => (
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

                </div>

                <div className='dark-secondary flex items-center gap-3 h-16 w-full p-5 rounded-xl mb-5'>
                    <button className='md:text-lg h-10 dark-primary rounded-full px-3 w-full text-sm'>Change Password</button>
                    <button 
                    onClick={logoutUser}
                    className='md:text-lg rounded-full h-10 px-3 w-full bg-red-400 text-sm'>Logout</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile
