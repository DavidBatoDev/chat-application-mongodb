import {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const NoConvoOpen = () => {
  const navigate = useNavigate()
  const {darkMode} = useSelector(state => state.theme)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        navigate('/nav');
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [window.innerWidth, navigate]);

  return (
   <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-[0.7] bg-slate-100 px-4`}>
    <div className='flex items-center justify-center h-full w-full'>
      <h1 className='text-2xl font-semibold text-center text-wrap '>Open a conversation to start chatting</h1>
    </div>
    </div>
  )
}

export default NoConvoOpen
