import React from 'react'

const Login = () => {
  return (
    <div className='h-full w-full flex justify-center items-center bg-white'>
      <div className='flex h-[90%] w-[90%] flex-col md:flex-row'>
        <div className='flex-1 flex flex-col justify-center items-center rounded'>
          <img 
            src="/logo-draft.png" 
            alt="Logo"
            className='md:w-72 md:h-72 h-56 w-56'
            />
          <h1 className='text-3xl font-semibold text-blue-700'>
            Full stack chat app
          </h1>
          <p className='texx-md text-gray-700'>
            Login to start chatting
          </p>
        </div>

        <div className='flex-1 flex justify-center items-center p-3'>
          <form className='md:shadow-2xl md:h-[70%] w-[90%] md:bg-white rounded-xl flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center w-full'>
              <h1 className='text-2xl font-semibold text-blue-700 mb-4'>
                Start Chatting!
              </h1>
              <input 
                type='text' 
                placeholder='Username' 
                className='placeholder:text-gray-600 w-[80%] h-12 md:bg-white border-b-2 text-black px-4 mb-4 rounded outline-none focus:ring-2 focus:ring-slate-400'
              />
              <input 
                type='password' 
                placeholder='Password' 
                className='placeholder:text-gray-600 w-[80%] h-12 md:bg-white border-b-2 text-black px-4 mb-4 rounded outline-none focus:ring-2 focus:ring-slate-400'
              />
              <button 
                className='w-[80%] h-12 bg-blue-400 font-semibold text-black px-4 mb-4 rounded outline-none'
              >
                Login
              </button>
              <p>
                Don't have an account? <a href='#' className='text-blue-500'>Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
