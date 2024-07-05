import React from 'react';
import Conversation from './Conversation';

const Conversations = ({currentChat, convos, highlightedConvos, onConversationClick }) => {
  return (
    <div className='flex flex-col'>
      {convos.map((convo, index) => (
        <Conversation
          key={index}
          currentChat={currentChat}
          convo={convo}
          isHighlighted={highlightedConvos.includes(convo._id)}
          onConversationClick={onConversationClick}
        />
      ))}
    </div>
  );
};

export default Conversations;
