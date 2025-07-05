import { useEffect, useRef, useState } from "react";

export default function ChatRoom({ room, messages, user, socket }) {
  const [chat, setChat] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const msgRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      setLiveMessages((prev) => [...prev, msg]); // ✅ use React state instead of innerHTML
    });

    socket.on("typing", (username) => {
      setTypingUser(username);
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const handleTyping = () => {
    socket.emit("typing");
    setTimeout(() => socket.emit("stopTyping"), 1000);
  };

  const handleSend = () => {
    if (chat.trim() === "") return;
    socket.emit("sendMessage", chat);
    setChat("");
  };

  const allMessages = [...messages, ...liveMessages]; // ✅ combine backend + real-time messages

  return (
    <div>
      <h2 className="text-2xl mb-2">{room.name}</h2> {/* ✅ fix: render actual room name */}
      <div
        className="h-64 overflow-y-auto border mb-2 bg-gray-50 p-2"
        ref={msgRef}
      >
        {allMessages.map((msg, i) => (
          <p key={msg._id || i}>
            <strong>{msg.sender?.username || "Unknown"}:</strong>{" "}
            {msg.content}
          </p>
        ))}
      </div>

      <div className="mb-2 text-sm text-gray-600">
        {typingUser && `${typingUser} is typing...`} {/* ✅ fix: template literal */}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}