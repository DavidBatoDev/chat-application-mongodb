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
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    clearError,

} from '../redux/userSlice/userSlice';
import axios from 'axios';
import { Backdrop, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // for user states
    const { user, loading, error } = useSelector(state => state.user);
    // for dark mode
    const { darkMode } = useSelector(state => state.theme);
    // for profile states
    const [formBody, setFormBody] = useState({
        socials: user?.socials || [],
    });
    // for file upload
    const fileRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(null);
    const [fileUploadProgress, setFileUploadProgress] = useState(0);
    // for socials states
    const [isEditingASocial, setIsEditingASocial] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [tempLink, setTempLink] = useState('');
    const [tempUsername, setTempUsername] = useState('');
    const [selectedSocial, setSelectedSocial] = useState('facebook'); 

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
                    profilePic: downloadURL,
                });
                setFileUploadError(null);
            });
        }
    )
    }

    
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

    // functions for socials
    // for opening and closing the modal
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTempLink('');
        setTempUsername('');
        setSelectedSocial('facebook');
        setIsEditingASocial(false);
        setSelectedIndex(null);
    };

    // for adding socials
    const handleAddSocial = () => {
        setFormBody({
            ...formBody,
            socials: [
                ...formBody.socials,
                {
                    social: selectedSocial,
                    link: tempLink,
                    username: tempUsername
                }
            ]
        });
        closeModal();
    };

    // for deleting socials
    const handleDeleteSocial = (index) => {
        setFormBody({
            ...formBody,
            socials: formBody.socials.filter((_, i) => i !== index)
        });
    }

    // for editing socials
    const openEditSocial = (index) => {
        setIsEditingASocial(true);
        setSelectedIndex(index);
        setSelectedSocial(formBody.socials[index].social);
        setTempLink(formBody.socials[index].link);
        setTempUsername(formBody.socials[index].username);
        openModal();
    }

    const handleEditSocial = () => {
        const editedSocial = {
            social: selectedSocial,
            link: tempLink,
            username: tempUsername
        }
        setFormBody(prevFormBody => ({
            ...prevFormBody,
            socials: prevFormBody.socials.map((social, i) => {
                if (i === selectedIndex) {
                    return editedSocial;
                }
                return social;
            })
        }));
        closeModal();
    };

    const handleSaveChanges = async e => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await axios.put(`/api/user/updateUser/${user._id}`, formBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authToken'))}`,
                },
            });
            if (res.status !== 200) {
                dispatch(updateUserFailure(res.data));
                return
            }
            dispatch(updateUserSuccess(res.data));
            console.log(res.data.socials);
            navigate('/app/user');
        } catch (error) {
            dispatch(updateUserFailure(error.response.data));
            console.log(error.response.data.errorMsg);
        }
    }


    return (
        <div className={`${darkMode && 'dark-theme'} flex flex-col h-full md:flex-[0.7] flex-1 bg-slate-100 px-4`}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                >
                <CircularProgress color="inherit" />
            </Backdrop>
            {error && (
                <div className='fixed top-10 left-1/2 flex bg-red-50 pr-3'>
                    <Alert className='transition-opacity' severity="error">{error}</Alert>
                    <button onClick={() => dispatch(clearError())} className='text-red-300'>x</button>
                </div>
            )}
            <form onSubmit={handleSaveChanges} className={`${darkMode && 'dark-primary'} h-full mb-3 bg-white p-4 mt-5 rounded-xl flex justify-between shadow overflow-y-scroll custom-scrollbar`}>
                <div className='fixed'>
                <IconButton onClick={() => navigate('/app/profile')}>
                    <KeyboardBackspaceIcon className='text-slate-500' />
                </IconButton>
                </div>
                <div className=' flex flex-col items-center w-full gap-5 md:px-2 lg:px-10'>
                    <div className={`relative ${darkMode && 'dark-secondary'} bg-slate-200 rounded-full mt-12 w-32 h-32`}>
                        <input hidden type="file" ref={fileRef} onChange={e => setFile(e.target.files[0])} accept='images/*' />
                        <img 
                            src={formBody?.profilePic || user?.profilePic} alt="profile-pic" 
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
                        ${darkMode && 'dark-secondary'} bg-slate-200 w-full rounded-xl flex flex-col gap-3 p-3
                    `}>
                        <div>
                            <div className='flex flex-col gap-2'>
                                <label className='font-semibold'>Edit Username: </label>
                                <input 
                                    className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100 '} text-xl font-semibold w-full p-2 rounded outline-none`}
                                    type="text"
                                    name='name'
                                    defaultValue={user?.name}
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={`
                        ${darkMode && 'dark-secondary'} bg-slate-200 w-full rounded-xl flex p-3 flex-col gap-5
                    `}>
                        <div className='flex flex-col gap-2'>
                            <label className='font-semibold'>Edit About Me:</label>
                            <textarea 
                                className={`${darkMode ? 'bg-slate-800' : 'bg-slate-100 '} w-full h-24 p-2 rounded outline-none`}
                                defaultValue={user?.aboutMe}
                                name='aboutMe'
                                onChange={handleChange}
                                />
                        </div>
                        <div>
                            <p className='font-semibold'>Add Socials</p>
                            <div className='flex flex-col mt-2 gap-2'>
                                {formBody?.socials.map((social, index) => (
                                    <div key={index} className='flex justify-between items-center'>
                                        <a href={social.link} target='_blank' className='flex gap-2'>
                                            {social.social === 'facebook' && <FacebookIcon />}
                                            {social.social === 'instagram' && <InstagramIcon />}
                                            {social.social === 'twitter' && <XIcon />}
                                            {social.social === 'link' && <LinkIcon />}
                                            <span>{social.username}</span>
                                        </a>
                                        <div>
                                            <EditIcon onClick={() => openEditSocial(index)} className='text-sm cursor-pointer'/>
                                            <DeleteIcon onClick={() => handleDeleteSocial(index)} className='text-sm text-red-300 cursor-pointer'/>
                                        </div>
                                    </div>
                                ))}
                                <div>
                                    <button type='button' className={`text-lg bg-slate-200 ${darkMode && 'dark-secondary bg-slate-900'} border border-black rounded-full px-3 py-2 w-full`} onClick={openModal}>Add Social</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <button type='submit' className={`${darkMode && 'dark-secondary'} bg-slate-200 text-lg rounded-full px-10 py-2 w-full mb-3`}>Save Changes</button>
                    </div>
                </div>
            </form>
            {/* Modal for adding/editing social */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${modalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className={`${darkMode ? 'dark-primary': "bg-slate-200"} p-5 rounded-lg max-w-md w-full`}>
                    <h2 className="text-xl font-semibold mb-4">Add Social Link</h2>
                    <div className="mb-4">
                        <label className="block mb-1">Select Social:</label>
                        <select
                            value={selectedSocial}
                            onChange={e => setSelectedSocial(e.target.value)}
                            className={`border ${darkMode ? 'border-slate-300' : 'border-slate-900'} w-full bg-transparent p-2 rounded-full outline-none`}
                        >
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter</option>
                            <option value='link'>Others</option>
                            {/* Add more options for other social networks */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Link:</label>
                        <input 
                            type="text"
                            value={tempLink}
                            onChange={e => setTempLink(e.target.value)}
                            placeholder='http://example.com'
                            className={`border ${darkMode ? 'border-slate-300' : 'border-slate-900'} w-full bg-transparent p-2 rounded-full outline-none`}
                            />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Username:</label>
                        <input 
                            type="text"
                            value={tempUsername}
                            onChange={e => setTempUsername(e.target.value)}
                            placeholder='username'
                            className={`border ${darkMode ? 'border-slate-300' : 'border-slate-900'} w-full bg-transparent p-2 rounded-full outline-none`}
                            />
                    </div>
                    <div className="flex justify-end gap-4">
                        {!isEditingASocial 
                            ? 
                            <button className="text-lg dark-secondary rounded-full px-3 py-2" onClick={handleAddSocial}>Add</button>
                            : 
                            <button className="text-lg dark-secondary rounded-full px-3 py-2" onClick={() => handleEditSocial(selectedIndex)}>Edit</button>
                            }
                        <button className="text-lg dark-secondary rounded-full px-3 py-2" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
