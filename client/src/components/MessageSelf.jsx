import React from 'react';
import { useSelector } from 'react-redux';
import { FiClock, FiAlertCircle } from 'react-icons/fi'; // Icons for sending and error states

const MessageSelf = ({ message }) => {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={`flex items-center my-3 w-full justify-end`}>
      <div className={`flex flex-row-reverse justify-start items-center`}>
        <div className={`${darkMode ? 'dark-secondary' : 'bg-slate-300'} flex flex-col p-3 rounded-xl min-w-56 max-w-40 md:max-w-72 lg:max-w-96 relative`}>
          <p className={`text-sm md:text-md break-all`}>
            {message.content}
          </p>
          <span className='flex justify-end text-xs text-gray-400'>today</span>
          
          {/* Visual indication for sending or error states */}
          {message?.status === 'sending' && (
            <div className="absolute left-2 bottom-2 flex items-center text-gray-500">
              <FiClock className="animate-pulse" /> {/* Clock icon with pulse animation */}
              <small className="ml-1">Sending</small>
            </div>
          )}
          {message?.status === 'error' && (
            <div className="absolute left bottom-2 flex items-center text-red-500">
              <FiAlertCircle /> {/* Error icon */}
              <small className="ml-1">Error</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageSelf;
