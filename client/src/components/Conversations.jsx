import React from 'react'
import Conversation from './Conversation';
import { useNavigate } from 'react-router-dom';

const Conversations = ({users}) => {
  const navigate = useNavigate()

  function handleClick() {
    navigate('chat')
  }

  return (
    <div className='flex flex-col'>
        {users.map((user, index) => (
            <Conversation key={index} user={user} onClick={handleClick} />
        ))}
    </div>
  )
}

export default Conversations
