import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
    getDownloadURL,
    ref,
    getStorage,
    uploadBytesResumable,
} from 'firebase/storage';
import {
    setError,
    clearError,
    startLoading,
    stopLoading,
} from '../redux/errorSlice/errorSlice';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const EditGroup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {chatId} = useParams();
    const {socket} = useSelector(state => state.socket);
    // for user states
    const { user } = useSelector(state => state.user);
    const { darkMode } = useSelector(state => state.theme);
    const {message, loading} = useSelector(state => state.error);
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [usersToBeAdded, setUsersToBeAdded] = useState([]);
    // for group info
    const [groupInfo, setGroupInfo] = useState(null);
    // for profile states
    const [formBody, setFormBody] = useState({
        chatName: groupInfo?.chatName,
        chatImage: groupInfo?.chatImage
    });;
    // for file upload
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(0);
    
    // for modal
    const [modalOpen, setModalOpen] = useState(false);

    // functions for file upload
    const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileUploadProgress(progress);
        }, (error) => {
            setFileUploadError(error.message);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setFormBody({
                    ...formBody,
                    chatImage: downloadURL,
                });
                setFileUploadError(null);
            });
        }
    )
    }

        useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const token = JSON.parse(localStorage.getItem('authToken'))
                    const res = await axios.get(`/api/user/fetchRelatedUsers`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    
                    })
                    setFetchedUsers([...res.data, user])
                } catch (error) {
                    console.log(error)
                    dispatch(setError(error.response.data.message))
                }
            }
            dispatch(clearError())
            fetchUsers()

            return () => {
                setFetchedUsers([])
            }
        }, [chatId])

    const fetchGroupInfo = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('authToken'));
            if (!token) {
                dispatch(setError('Please login first'));
            }
            const res = await axios.get(`/api/chat/fetchChatById/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGroupInfo(res.data);
            const groupUsers = res.data.users.map(user => user._id);
            setFormBody({
                chatName: res.data.chatName,
                chatImage: res.data.chatImage,
                users: groupUsers
            });
        } catch (error) {
            console.log(error.response.data)
            dispatch(setError("There's an error with group info"));
        }
    }

    // console.log(formBody.users)

    useEffect(() => {
        fetchGroupInfo()

        return () => {
            setGroupInfo(null);
            dispatch(clearError());
        }
    }, [chatId]);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);
    
    // functions for changing profile
    const handleChange = e => {
        setFormBody({
          ...formBody,
          [e.target.name]: e.target.value
        })
    }

    // select user
    const handleSelectUser = (userId, checkbox) => {
        if (checkbox.checked) {
            setUsersToBeAdded([...usersToBeAdded, userId])
        } else {
            setUsersToBeAdded(usersToBeAdded.filter(user => user !== userId))
        }
        console.log(usersToBeAdded)
    }

    // for opening and closing the modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setUsersToBeAdded([]);
    };

    const handleAddUser = () => {
        const addedUsers = fetchedUsers.filter(user => usersToBeAdded.includes(user._id)); 
        setFormBody({
            ...formBody,
            users: [...formBody.users, ...usersToBeAdded]
        })
        setGroupInfo({
            ...groupInfo,
            users: [...groupInfo.users, ...addedUsers]
        })
        closeModal();
    }

    const handleSaveChanges = async e => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('authToken'));
            const body = {
                chatName: formBody.chatName,
                chatImage: formBody.chatImage,
                users: formBody.users
            }
            console.log(formBody.users)
            const res = await axios.put(`/api/chat/update-group/${chatId}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data?.success === false) return dispatch(setError(res.data.message));
            console.log(res.data.usersThatIsRemoved)
            console.log(res.data.usersThatIsAdded)
            if (res.data.usersThatIsRemoved.length > 0) {
                const data = {
                    chat: res.data.chat,
                    users: res.data.usersThatIsRemoved
                }
                socket.emit('remove chat to user', data);
            }
            if (res.data.usersThatIsAdded.length > 0) {
                const data = {
                    chat: res.data.chat,
                    users: res.data.usersThatIsAdded
                }
                socket.emit('add chat to user', data);
            }
            navigate(`/app/chat/${chatId}`);
        } catch (error) {
            console.log(error.response.data)
        }
    }

    const handleRemoveMember = (index) => {
        const newUsers = formBody.users.filter((user, i) => i !== index);
        setFormBody({
            ...formBody,
            users: newUsers
        })
        setGroupInfo({
            ...groupInfo,
            users: groupInfo.users.filter((user, i) => i !== index)
        })
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
                <div className='fixed top-10 left-1/2 flex bg-red-50 pr-3'>
                    <Alert className='transition-opacity' severity="error">{message}</Alert>
                    <button onClick={() => dispatch(clearError())} className='text-red-300'>x</button>
                </div>
            )}
            <form onSubmit={handleSaveChanges} className={`${darkMode && 'dark-primary'} h-full mb-3 bg-white p-4 mt-5 rounded-xl flex justify-between shadow overflow-y-scroll custom-scrollbar`}>
                <div className='absolute'>
                <IconButton onClick={() => navigate(-1)}>
                    <KeyboardBackspaceIcon className='text-slate-500' />
                </IconButton>
                </div>
                <div className=' flex flex-col items-center w-full gap-5 md:px-2 lg:px-10'>
                    <div className={`relative dark-secondary rounded-full mt-12 w-32 h-32`}>
                        <input hidden type="file" ref={fileRef} onChange={e => setFile(e.target.files[0])} accept='images/*' />
                        <img 
                            src={formBody?.chatImage || groupInfo?.chatImage} alt="chatImage" 
                            onClick={() => fileRef.current.click()}
                            className='w-32 h-32 object-cover rounded-full cursor-pointer'
                        />
                        <div className='absolute right-2 bottom-2'>
                            <EditIcon />
                        </div>
                        {
                            fileUploadProgress > 0 && fileUploadProgress < 100 && (
                                <div className='left-12 top-14 absolute'>
                                    <progress value={fileUploadProgress} max='100'>{fileUploadProgress}</progress>
                                </div>
                            )
                        }
                    </div>
                    
                    <div className={`
                        dark-secondary w-full rounded-xl flex flex-col gap-3 p-3
                    `}>
                        <div>
                            <div className='flex flex-col gap-2'>
                                <label className='font-semibold'>Edit Group Name: </label>
                                <input 
                                    className='text-xl font-semibold w-full dark-primary p-2 rounded outline-none'
                                    type="text"
                                    name='chatName'
                                    value={formBody?.chatName}
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={`
                        dark-secondary w-full rounded-xl flex p-3 flex-col gap-5
                    `}>
                        <div>
                            <p className='font-semibold'>Members:</p>
                            <div className='flex flex-col mt-2 gap-2'>
                                {groupInfo?.users.map((u, index) => (
                                    <div key={index} className='flex justify-between items-center'>
                                        <div className='flex gap-2'>
                                            <span>{u?.name}</span>
                                        </div>
                                        <div className={`${u._id == user._id && 'hidden'}`}>
                                            <DeleteIcon onClick={() => handleRemoveMember(index)} className='text-sm text-red-300 cursor-pointer'/>
                                        </div>
                                    </div>
                                ))}
                                <div>
                                    <button type='button' className='text-lg dark-primary rounded-full px-3 py-2 w-full' onClick={openModal}>Add Member</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button type='submit' className='text-lg rounded-full px-10 py-2 w-full dark-secondary mb-3'>Save Changes</button>
                    </div>
                </div>
            </form>
            {/* Modal for adding member */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`${darkMode ? 'dark-primary': "bg-slate-200"} p-5 rounded-lg max-w-md w-full`}>
                    <div>
                        <h1 className="text-2xl font-semibold">Add Member</h1>
                        {fetchedUsers.filter((user => {
                            return !groupInfo?.users.find(u => u._id === user._id)
                        })).map(user => (
                        <div key={user._id} className='flex justify-between items-center py-3'>
                            <div className='flex items-center gap-2'>
                                {/* <AccountCircleIcon className='text-slate-400'/> */}
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
                    <div className="flex justify-end gap-4">
                        <button className="text-lg dark-secondary rounded-full px-3 py-2" onClick={handleAddUser}>Add</button>
                        <button className="text-lg dark-secondary rounded-full px-3 py-2" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditGroup