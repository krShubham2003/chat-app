import { useEffect, useRef, useState } from "react";
import { ChatProps, Message, User } from "../interfaces";
import { socket } from "../services/socket";
import Header from "./chat/Header";
import Notification from "./chat/Notification";
import Sidebar from "./chat/Sidebar";
import { FiSend } from "react-icons/fi";
import MessageComp from "./chat/MessageComp";

const Chat = ({ currentUser, onLogout }: ChatProps) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notification, setNotification] = useState<{
    text: string;
    type: "join" | "leave" | "message";
  } | null>(null);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hide notification after 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const handleNewMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);
    const handleMessageHistory = (history: Message[]) => setMessages(history);
    const handleUserList = (userList: User[]) => setUsers(userList);
    const handleUserLeft = (username: string) => setNotification({ text: `${username} left the chat`, type: "leave" });
    const handleUserJoined = (username: string) => setNotification({ text: `${username} joined the chat`, type: "join" });

    const handleTyping = (username: string) =>
      setTypingUsers((prev) => [...new Set([...prev, username])]);

    const handleStopTyping = (username: string) =>
      setTypingUsers((prev) => prev.filter((u) => u !== username));

    socket.on("newMessage", handleNewMessage);
    socket.on("messageHistory", handleMessageHistory);
    socket.on("userList", handleUserList);
    socket.on("userLeft", handleUserLeft);
    socket.on("userJoined", handleUserJoined);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageHistory", handleMessageHistory);
      socket.off("userList", handleUserList);
      socket.off("userLeft", handleUserLeft);
      socket.off("userJoined", handleUserJoined);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && currentUser) {
      socket.emit("sendMessage", message);
      setMessage('');
      socket.emit("stopTyping", currentUser.username);
    }
  };

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (currentUser && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", currentUser.username);

      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stopTyping", currentUser.username);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-violet-50 to-white">

      {/* Header */}
      <Header currentUser={currentUser} onLogout={onLogout} users={users} />

      {/* Notification */}
      {notification && (
        <div className="mx-auto mt-2">
          <Notification text={notification.text} type={notification.type} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentUser={currentUser} users={users} />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col justify-between border-l border-gray-200 bg-white shadow-inner">

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-400 scrollbar-track-violet-100">
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map(({ user, timestamp, message }, index) => (
                <div key={index} className={`flex ${user.id === socket.id ? "justify-end" : "justify-start"}`}>
                  <MessageComp socket={socket} message={message} timestamp={timestamp} user={user} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="text-gray-500 text-sm px-6 py-1 animate-pulse">
              {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-300 shadow-sm">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={handleTypingChange}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-violet-400 focus:outline-none transition duration-200"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="absolute right-2 p-2 bg-violet-500 hover:bg-violet-600 text-white rounded-full transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
