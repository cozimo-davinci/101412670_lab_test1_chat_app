import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function Dashboard() {
    const [rooms] = useState(['devops', 'cloud computing', 'covid19', 'sports', 'nodeJS']); // Predefined rooms
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // For private messages
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket] = useState(io('http://localhost:7000'));
    const [currentUser, setCurrentUser] = useState(null); // State for currentUser

    useEffect(() => {
        // Get the logged-in user from localStorage
        const loggedInUser = localStorage.getItem('user');
        setCurrentUser(loggedInUser);

        // Register user to socket
        if (loggedInUser) {
            socket.emit('register', loggedInUser);
        }

        // Fetch message history for private chats
        socket.on('privateMessagesHistory', (data) => {
            setMessages(data);
        });

        // Fetch group messages when joining a room
        socket.on('groupMessagesHistory', (data) => {
            setMessages(data);
        });

        // Listen for incoming private messages
        socket.on('privateMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Listen for incoming group messages
        socket.on('group_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    // Send a private message
    const sendPrivateMessage = () => {
        if (!message || !selectedUser) return;

        socket.emit('privateMessage', {
            sender: currentUser,
            receiver: selectedUser,
            message,
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: currentUser, message, date_sent: new Date() },
        ]);

        setMessage('');
    };

    // Send a group message
    const sendGroupMessage = () => {
        if (!message || !selectedRoom) return;

        socket.emit('group_message', {
            from_user: currentUser,
            room: selectedRoom,
            message,
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            { from_user: currentUser, message, date_sent: new Date() },
        ]);

        setMessage('');
    };

    // Join a room (group chat)
    const joinRoom = (room) => {
        socket.emit('join_room', room);
        setSelectedRoom(room);

        // Fetch group message history for this room
        socket.emit('join_room', room);
    };

    // Leave the current room
    const leaveRoom = () => {
        if (selectedRoom) {
            socket.emit('leave_room', selectedRoom);
            setSelectedRoom(null);
            setMessages([]);
        }
    };

    // Open private chat with a user
    const openPrivateChat = (username) => {
        setSelectedUser(username);
        setMessages([]); // Clear messages before opening a new private chat

        socket.emit('fetchPrivateMessages', { sender: currentUser, receiver: username });
    };
    return (
        <div className="dashboard-container flex h-screen">
            {/* Room List */}
            <div className="room-list w-1/4 bg-gray-800 text-white p-4 h-full overflow-y-auto">
                <h3 className="text-lg font-bold">Rooms</h3>
                <ul>
                    {rooms.map((room, index) => (
                        <li key={index} className="my-2 cursor-pointer" onClick={() => joinRoom(room)}>
                            {room}
                        </li>
                    ))}
                </ul>
                <hr className="my-4" />
                <h3 className="text-lg font-bold">Users</h3>
                {/* Here, you can list your users */}
                <ul>
                    {/* Example user list */}
                    {['user1', 'user2', 'user3'].map((user, index) => (
                        <li key={index} className="my-2 cursor-pointer" onClick={() => openPrivateChat(user)}>
                            {user}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Area */}
            <div className="chat-area w-3/4 p-4 bg-stone-950 h-full flex flex-col">
                <h2 className="text-2xl font-extrabold text-yellow-50">Chat</h2>

                {/* Room info and leave button */}
                {selectedRoom && (
                    <div className="room-info flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Room: {selectedRoom}</h3>
                        <button
                            className="leave-button text-sm text-red-500"
                            onClick={leaveRoom}
                        >
                            Leave Room
                        </button>
                    </div>
                )}

                {/* Private chat user info */}
                {selectedUser && !selectedRoom && (
                    <div className="user-info mb-4">
                        <h3 className="text-lg font-semibold">Chatting with: {selectedUser}</h3>
                    </div>
                )}

                <div className="messages-container my-4 flex-1 overflow-y-auto bg-yellow-300">
                    {messages.length === 0 && <p>No messages yet. Start chatting!</p>}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}>
                            <strong>{msg.sender}:</strong> {msg.message}
                            <span className="text-sm text-gray-500">{new Date(msg.date_sent).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="message-input mt-4">
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className="send-button mt-2 p-2 bg-blue-500 text-white rounded"
                        onClick={selectedRoom ? sendGroupMessage : sendPrivateMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
