import {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const NoConvoOpen = () => {
  const navigate = useNavigate()
  const {darkMode} = useSelector(state => state.theme)

  return (
   <div className={`${darkMode && 'dark-theme'} flex flex-col h-full flex-1 md-flex-[0.7] bg-slate-100 px-4`}>
        <div className={`${darkMode && 'dark-primary'} h-full mb-3 bg-white p-4 mt-5 rounded-xl flex justify-between shadow`}>
            <div className='flex flex-col items-center w-full gap-5'>
                <div className={`dark-secondary mt-12 rounded-full w-32 h-32 overflow-hidden`}>
                    img
                </div>

                <div className={`
                    dark-secondary w-full rounded-xl h-46 flex flex-col gap-3 p-3
                `}>
                    <div>
                        <h1 className='text-2xl font-semibold'>David</h1>
                        <small>batobatodavid20@gmail.com</small>
                    </div>
                    <div className='flex gap-2'>
                        <button className='text-lg dark-primary rounded-full px-3 py-2 w-full '>Add Status</button>
                        <button className='text-lg dark-primary rounded-full px-3 py-2 w-full '>Edit Profile</button>
                    </div>
                </div>

                <div className={`
                    dark-secondary w-full rounded-xl h-48 flex p-3 flex-col
                `}>
                    <p className='font-semibold'>About Me</p>
                    <p>Hello</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NoConvoOpen
