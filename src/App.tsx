import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { v4 as uuidv4 } from "uuid";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { chatQuery } from "./hooks/use-chat-query";

const App = () => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [runId, setRunId] = useState(() => localStorage.getItem("runId"));

  const hasUniqId = !!(runId && userId);

  const createAssistantMutation = chatQuery.mutation.useCreateAssistant();
  const createMessageMutation = chatQuery.mutation.useCreateMessage();

  const isFirst = useRef(false);

  // check userID and runId to call API create Assistant
  useEffect(() => {
    if (!isFirst.current) {
      isFirst.current = true;
      return;
    }

    if ((userId && runId) || createAssistantMutation.isPending) return;

    const uniqId = uuidv4();

    // set userId
    localStorage.setItem("userId", uniqId);
    setUserId(uniqId);

    createAssistantMutation.mutate(
      {
        user_id: uniqId,
      },
      {
        onSuccess({ run_id }) {
          // set runId
          localStorage.setItem("runId", run_id);
          setRunId(run_id);
        },
        onError(error) {
          console.log("🚀 ~ App ~ error:", error);
        },
      }
    );
  }, [createAssistantMutation, runId, userId]);

  const {
    data: messages,
    isFetching,
    isSuccess,
    refetch,
  } = chatQuery.useMessage({
    run_id: runId,
    user_id: userId,
  });

  useEffect(() => {
    if (isSuccess) setNewMessage(undefined);
  }, [isSuccess]);

  const [newMessage, setNewMessage] = useState<string>();

  // const [_, setMessages] = useState([
  // {
  //   message: "Hello, how can I help you?",
  //   sentTime: "just now",
  //   sender: "ChatBot",
  //   direction: "incoming", // Thêm thuộc tính direction để xác định hướng tin nhắn
  // },
  // ]);
  // const [typing, setTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSend = async (message: string) => {
    setNewMessage(message);

    createMessageMutation.mutate(
      {
        run_id: runId!,
        user_id: userId!,
        message: escapeHtml(message),
      },
      {
        onSuccess() {
          refetch();
          setNewMessage(undefined);
          // setTyping(false);

          // setTyping(true);
          // setTimeout(() => {
          //   refetch();
          //   setNewMessage(undefined);
          //   setTyping(false);
          // }, 3000);
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

  return hasUniqId ? (
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
                  (isFetching || createMessageMutation.isPending) && (
                    <TypingIndicator content="ChatBot is typing" />
                  )
                }
              >
                {/* First intro */}
                <Message
                  model={{
                    message: "Hello, how can I help you?",
                    sentTime: "just now",
                    sender: "User",
                    direction: "incoming",
                  }}
                  className="incoming"
                />

                {messages?.map((msg, index) => (
                  <Message key={index} model={msg} className={msg.direction} />
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
  ) : null;
};

export default App;

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
