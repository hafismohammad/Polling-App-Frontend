import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { getUser } from "../services/userService";
import { authContext } from "../context/AuthContext";
import { getAllMessages } from "../services/chatService";
import useSocket from "../hooks/useSocket";
import Profile from "../../src/assets/profile-img.png";

function UserChat() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  // const socket = useSocket('https://polling-app.hpc.tw');
  const socket = useSocket('http://localhost:8000');

  const { token } = useContext(authContext);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(token);
        setUser(response.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getAllMessages(token);
        setMessages(response.data?.allmessages || []);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    if (token) {
      fetchMessages();
    }
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            user: newMessage.userName,
          },
        ]);
        scrollToBottom();
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveMessage");
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      userID: user.id,
      userName: user.name,
      message,
      groupId: "general",
    };

    socket.emit("sendMessage", newMessage);
    socket.emit("chatNotification", { userName: user.name, message });
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, user: user.name },
    ]);
    setMessage("");
    scrollToBottom();
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { userName: user?.name });
  };

  useEffect(() => {
    if (socket) {
      socket.on("userTyping", (typingData) => {
        setTypingUser(typingData);
        const timer = setTimeout(() => setTypingUser(""), 3000);
        return () => clearTimeout(timer);
      });
    }
  }, [socket]);

  return (
    <div className="flex justify-center mt-20">
      <div className="h-[80vh] w-full max-w-5xl bg-white shadow-md flex flex-col">
        <div className=" flex items-center justify-center h-[7vh] w-full p-3 bg-gray-700 ">
          <h1 className="text-white ml-3 justify-center ">
            General Group Chat
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto  scroll-smooth p-4 bg-gray-100">
          <div className="flex flex-col space-y-4 p-1 chat-window relative">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 ${
                  msg.user === user.name ? "justify-end" : "justify-start"
                }`}
              >
                {msg.user !== user.name && (
                  <img
                    src={Profile}
                    className="h-12 w-12 bg-slate-600 rounded-full"
                    alt="profile"
                  />
                )}
                <div
                  className={`chat-bubble p-3 ${
                    msg.user === user.name
                      ? "bg-blue-500 text-white rounded-tl-lg rounded-bl-lg rounded-tr-lg"
                      : "bg-gray-300 text-gray-800 rounded-tl-lg rounded-br-lg rounded-tr-lg"
                  }`}
                  style={{ maxWidth: "75%", wordBreak: "break-word" }}
                >
                  <h1 className="font-bold mb-1">{msg.user}</h1>
                  <p>{msg.message}</p>
                </div>
                {msg.user === user.name && (
                  <img
                    src={Profile}
                    className="h-12 w-12 bg-slate-600 rounded-full"
                    alt="profile"
                  />
                )}
              </div>
            ))}
            {typingUser && (
              <div className="typing-indicator absolute bottom-4 left-4 flex space-x-1 items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>
        </div>

        <div className="h-[7vh] w-full p-3 bg-gray-700 flex items-center space-x-11">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type a message"
            className="w-full max-w-4xl p-2 rounded-lg bg-gray-700 text-gray-200 focus:outline-none"
          />
          <FontAwesomeIcon
            onClick={handleSendMessage}
            className="h-5 w-5 text-white transition-all duration-300 hover:h-7 hover:w-7 cursor-pointer"
            icon={faPaperPlane}
          />
        </div>
      </div>
    </div>
  );
}

export default UserChat;
