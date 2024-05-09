import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import NoConvoOpen from './NoConvoOpen';
import Message from './Message';


const MainArea = ({additionalClass}) => {
  return (
    <div className={`flex flex-col h-full ${additionalClass} bg-slate-100 px-4`}>
       {/* nav */}
       <div className='bg-white p-3 mt-5 rounded-xl flex justify-between shadow'>
        <div className='flex items-center'>
          <IconButton>
            <AccountCircleIcon className='text-slate-500' />
          </IconButton>
          <div className='flex flex-col'>
            <h1 className='font-semibold'>John Doe</h1>
            <p className='text-xs'>online</p>
          </div>
        </div>
        <div>
          <IconButton>
            <MoreHorizIcon className='text-slate-500' />
          </IconButton>
        </div>
      </div>

      <div className='flex-1 bg-white mt-3 rounded-xl shadow px-3 overflow-auto'>
        <div className='flex flex-col-reverse h-full'>
          <div className='overflow-y-auto'>
            {/* start loop here */}
              <Message />

              <div className={`flex items-center my-3 w-full justify-end`}>
                <div className={`flex flex-row-reverse justify-start items-center`}>
                  {/* <IconButton>
                    <AccountCircleIcon className='text-slate-500' />
                  </IconButton> */}
                  <div className='flex flex-col bg-slate-300 p-3 rounded-xl min-w-14 max-w-40 md:max-w-72 lg:max-w-96'>
                    {/* <h1 className='font-semibold'>John Doe</h1> */}
                    <p className={`flex justify-end text-sm md:text-md text-wrap break-words`}>I'm fine</p>
                  </div>
                </div>
              </div>
            {/* end loop here */}
          </div>
        </div>
      </div>

      <div className='flex items-center my-3 shadow p-3 rounded-xl overflow-hidden w-full bg-white'>
        <textarea type="text" placeholder='Message...' className='flex-1 h-10 resize-none text-wrap py-3 outline-none' />
        <IconButton>
          <SendIcon className='text-slate-500' />
        </IconButton>
      </div>
    </div>
  )
}

export default MainArea
