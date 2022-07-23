import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, author, room }) => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    console.log('1111');
    if (message.length) {
      const date = new Date(Date.now());
      const messageData = {
        room,
        author,
        message,
        time: date.getHours() + ':' + date.getMinutes(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map(({ message, time, author: msgAuthor }, idx) => {
            return (
              <div
                key={idx}
                className="message"
                id={author === msgAuthor ? 'you' : 'other'}
              >
                <div>
                  <div className="message-content">
                    <p>{message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{time}</p>
                    <p id="author">{msgAuthor}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          placeholder="..."
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          onKeyPress={({ key }) => key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
