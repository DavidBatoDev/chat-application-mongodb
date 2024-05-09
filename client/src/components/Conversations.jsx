import React from 'react'
import Conversation from './Conversation';

const Conversations = ({users}) => {
  return (
    <div className='flex flex-col'>
        {users.map((user, index) => (
            <Conversation key={index} user={user} />
        ))}
    </div>
  )
}

export default Conversations
