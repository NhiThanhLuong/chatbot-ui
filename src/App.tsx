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
import "./App.css";
import { chatQuery } from "./hooks/use-chat-query";

const App = () => {
  const {
    data: messages,
    isFetching,
    isSuccess,
    refetch,
  } = chatQuery.useMessage();

  useEffect(() => {
    if (isSuccess) setNewMessage(undefined);
  }, [isSuccess]);

  console.log("🚀 ~ App ~ messages:", messages);

  // useEffect(() => {
  //   if (inView && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [fetchNextPage, hasNextPage, inView]);

  const [newMessage, setNewMessage] = useState<string>();

  const { mutate, isPending } = chatQuery.mutation.useCreateMessage();

  // const [_, setMessages] = useState([
  //   {
  //     message: "Hello, how can I help you?",
  //     sentTime: "just now",
  //     sender: "ChatBot",
  //     direction: "incoming", // Thêm thuộc tính direction để xác định hướng tin nhắn
  //   },
  // ]);
  const [typing, setTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSend = async (message: string) => {
    setNewMessage(message);

    mutate(
      {
        thread_id: "thread_pxfPwS4fH0I6zWwlgM3nMqLS",
        assistant_id: "asst_YlxsQanQ2na97y5ASWcCod9A",
        role: "user",
        content: message,
      },
      {
        onSuccess() {
          setTyping(true);
          setTimeout(() => {
            refetch();
            setNewMessage(undefined);
            setTyping(false);
          }, 3000);
        },
      }
    );

    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   { message, sentTime: "just now", sender: "User", direction: "outgoing" },
    // ]);
    // // Fake a bot response
    // setTyping(true);
    // setTimeout(() => {
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     {
    //       message: "I'm here to assist you!",
    //       sentTime: "just now",
    //       sender: "ChatBot",
    //       direction: "incoming",
    //     },
    //   ]);
    //   setTyping(false);
    // }, 1000);
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
                  (isPending || typing) && (
                    <TypingIndicator content="ChatBot is typing" />
                  )
                }
              >
                {messages?.map((msg) => (
                  <Message key={msg.id} model={msg} className={msg.direction} />
                ))}
                {newMessage && (
                  <Message
                    model={{
                      sender: "User",
                      message: newMessage,
                      direction: "outgoing",
                      sentTime: "just now",
                    }}
                    className="outgoing"
                  />
                )}
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
