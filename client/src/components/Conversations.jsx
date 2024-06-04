import React from 'react'
import Conversation from './Conversation';

const Conversations = ({convos}) => {
  return (
    <div className='flex flex-col'>
        {convos.map((convo, index) => (
            <Conversation key={index} convo={convo} />
        ))}
    </div>
  )
}

export default Conversations
