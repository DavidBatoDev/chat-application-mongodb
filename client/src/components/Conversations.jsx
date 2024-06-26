import React from 'react'
import Conversation from './Conversation';

const Conversations = ({convos, socket}) => {
  return (
    <div className='flex flex-col'>
        {convos.map((convo, index) => (
            <Conversation key={index} convo={convo} socket={socket} />
        ))}
    </div>
  )
}

export default Conversations
