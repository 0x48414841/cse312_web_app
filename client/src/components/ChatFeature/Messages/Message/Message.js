import React from 'react';

 
import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name }) => {

  const isSentByCurrentUser = user === name;

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{name}</p>
          <div className="messageBox backgroundBlue">
            <div className="messageText colorWhite">{ReactEmoji.emojify(text)}</div>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <div className="messageText colorDark">{ReactEmoji.emojify(text)}</div>
            </div>
            <div className="sentText pl-10 ">{user}</div>
          </div>
        )
  );
}

export default Message;