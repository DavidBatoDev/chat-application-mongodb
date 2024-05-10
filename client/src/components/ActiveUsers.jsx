import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

const ActiveUsers = () => {
  return (
    <div className='flex flex-col gap-1 mt-2 w-full h-full'>
        <div className='flex justify-between w-full bg-white mt-3 py-2 border-b-2'>
            <h1 className='p-3 font-semibold'>
                Active Users
            </h1>
        </div>
        <div>

        <div className='flex items-center gap-1 mx-3 py-2 mt-2 px-3 rounded-xl border overflow-hidden'>
          <SearchIcon className='text-slate-500' />
          <input type="text" placeholder='Search' className='w-full bg-whit bg-transparent focus:outline-none' />
        </div>

      </div>
        <div className='bg-white flex-1 mb-3 rounded-xl p-3 pt-0'>
            <div className='flex flex-col overflow-auto mt-1 mb-3'>
                <div className='flex items-center py-3 border-b-2'>
                    <div className='flex items-center gap-2'>
                        <AccountCircleIcon className='text-slate-400'/>
                        Name
                    </div>
                </div>
                <div className='flex items-center py-3 border-b-2'>
                    <div className='flex items-center gap-2'>
                        <AccountCircleIcon className='text-slate-400'/>
                        Name
                    </div>
                </div>
                <div className='flex items-center py-3 border-b-2'>
                    <div className='flex items-center gap-2'>
                        <AccountCircleIcon className='text-slate-400'/>
                        Name
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ActiveUsers
