import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import { useEffect, useState } from "react";
import "./App.css"; // Import file CSS tùy chỉnh
import { chatQuery } from "./hooks/use-chat-query";
import axiosClient from "./axios-client";
import axios from "axios";

const App = () => {
  chatQuery.useThread();
  chatQuery.useMessage();

  useEffect(() => {
    axios.get(
      "http://a63b08641a04348858b07d0c71ac3eba-733487664.ap-southeast-1.elb.amazonaws.com:3000/v1/message",
      {
        params: {
          thread_id: "thread_UaiMYsqSHL5GnaFxkPDyNCA4",
        },
      }
    );
  }, []);

  const [messages, setMessages] = useState([
    {
      message: "Hello, how can I help you?",
      sentTime: "just now",
      sender: "ChatBot",
      direction: "incoming", // Thêm thuộc tính direction để xác định hướng tin nhắn
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State để quản lý trạng thái mở/đóng của chat box

  const handleSend = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message, sentTime: "just now", sender: "User", direction: "outgoing" },
    ]);

    // Fake a bot response
    setTyping(true);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: "I'm here to assist you!",
          sentTime: "just now",
          sender: "ChatBot",
          direction: "incoming",
        },
      ]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div>
      {isChatOpen ? (
        <div className="chat-container">
          <div className="chat-header">
            <span>Chat with us</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="chat-close-button"
            >
              &times;
            </button>
          </div>
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  typing && <TypingIndicator content="ChatBot is typing" />
                }
              >
                {messages.map((msg, i) => (
                  <Message key={i} model={msg} className={msg.direction} />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type a message..."
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      ) : (
        <button
          onClick={() => setIsChatOpen(true)}
          className="chat-icon-button"
        >
          <i className="fas fa-comments"></i>
        </button>
      )}
    </div>
  );
};

export default App;
