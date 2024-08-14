import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import LinkIcon from '@mui/icons-material/Link';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axios from 'axios';
import { logout } from '../redux/userSlice/userSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const { darkMode } = useSelector(state => state.theme);
    const { socket } = useSelector(state => state.socket);

    const logoutUser = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('authToken'));

            const res = await axios.get(`/api/user/is-offline`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 201) {
                socket.emit('user offline', res.data.userId);
            } else {
                console.error('Unexpected status code:', res.status);
            }
            dispatch(logout());
            localStorage.removeItem('authToken');
        } catch (error) {
            console.log('Error logging out user:', error);
        }
    };

    return (
        <div className={`flex flex-col h-full md:flex-[0.7] flex-1 px-4 ${darkMode ? 'dark-theme' : 'bg-slate-100'}`}>
            <div
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}  
                className={`h-full mb-3 p-4 mt-5 rounded-xl flex justify-between shadow overflow-y-scroll ${darkMode ? 'dark-primary' : 'bg-white'}`}>
                <div className='md:hidden fixed'>
                    <IconButton onClick={() => navigate('/nav')}>
                        <KeyboardBackspaceIcon className='text-slate-500' />
                    </IconButton>
                </div>
                <div className='flex flex-col items-center w-full gap-5 md:px-2 lg:px-10 pb-40'>
                    <div className={`relative rounded-full mt-12 w-32 h-32 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        <img
                            src={user?.profilePic}
                            alt="Profile"
                            className='w-32 h-32 object-cover rounded-full cursor-pointer'
                        />
                    </div>
                    <div className={`w-full rounded-xl h-46 flex flex-col gap-3 p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div>
                            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{user?.name}</h1>
                            <small className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</small>
                        </div>
                        <div className='flex gap-2'>
                            <button className={`text-lg rounded-full px-3 py-2 w-full ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'}`}>
                                Add Status
                            </button>
                            <button
                                onClick={() => navigate('/app/edit-profile')}
                                className={`text-lg rounded-full px-3 py-2 w-full ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'}`}>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className={`w-full rounded-xl flex p-3 flex-col gap-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div>
                            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>About Me</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{user?.aboutMe}</p>
                        </div>
                        <div>
                            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>User since</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{user?.createdAt.split("T")[0]}</p>
                        </div>
                        <div>
                            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Socials</p>
                            <div className='flex flex-col mt-2 gap-2'>
                                {user?.socials.map((social, index) => (
                                    <div key={index} className='flex gap-2 items-center'>
                                        {social.social === 'instagram' && <InstagramIcon className={darkMode ? 'text-gray-300' : 'text-gray-600'} />}
                                        {social.social === 'facebook' && <FacebookIcon className={darkMode ? 'text-gray-300' : 'text-gray-600'} />}
                                        {social.social === 'twitter' && <XIcon className={darkMode ? 'text-gray-300' : 'text-gray-600'} />}
                                        {social.social === 'link' && <LinkIcon className={darkMode ? 'text-gray-300' : 'text-gray-600'} />}
                                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{social.username}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 h-16 w-full p-5 rounded-xl mb-5'>
                        <button
                            onClick={logoutUser}
                            className={`md:text-lg rounded-full h-10 px-3 w-full ${darkMode ? 'bg-red-500 text-white' : 'bg-red-400 text-white'}`}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
