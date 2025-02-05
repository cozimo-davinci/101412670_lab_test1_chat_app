import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export default function Dashboard() {
    const [groups, setGroups] = useState([]); // Fetched groups from DB (each group is an object)
    const [selectedRoom, setSelectedRoom] = useState(null); // Will store the entire group object
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);

    const typingTimeoutRef = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        socket.current = io('http://localhost:7000');

        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(loggedInUser?.username);

        if (loggedInUser) {
            socket.current.emit('register', loggedInUser.username);
        }

        socket.current.on('privateMessage', (data) => setMessages((prev) => [...prev, data]));
        socket.current.on('group_message', (data) => setMessages((prev) => [...prev, data]));

        fetchUsers();
        fetchGroups(); // Fetch groups from the database

        return () => {
            socket.current.off('privateMessage');
            socket.current.off('group_message');
            socket.current.disconnect();
        };
    }, []);

    // Fetch users list
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/auth/all_users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Fetch groups from the backend
    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:7000/api/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);

        if (!isTyping) {
            socket.current.emit('typing', { sender: currentUser, receiver: selectedUser });
            setIsTyping(true);
        }

        // Clear previous timeout
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Set new timeout for stopping typing
        typingTimeoutRef.current = setTimeout(() => {
            socket.current.emit('stopTyping', { sender: currentUser, receiver: selectedUser });
            setIsTyping(false);
        }, 1000);
    };

    useEffect(() => {
        socket.current.on('typing', ({ sender }) => {
            setTypingUser(sender);
        });

        socket.current.on('stopTyping', ({ sender }) => {
            if (sender === typingUser) {
                setTypingUser(null);
            }
        });

        return () => {
            socket.current.off('typing');
            socket.current.off('stopTyping');
        };
    }, [typingUser]);

    // Send a private message
    const sendPrivateMessage = () => {
        if (message.trim() && selectedUser) {
            socket.current.emit('privateMessage', { sender: currentUser, receiver: selectedUser, message });
            setMessages((prev) => [...prev, { sender: currentUser, message, date_sent: new Date() }]);
            setMessage('');
        }
    };

    // Send a group message
    const sendGroupMessage = async () => {
        if (message.trim() && selectedRoom) {
            try {
                // Use selectedRoom._id to send the message
                const response = await axios.post(`http://localhost:7000/api/group_messages/${selectedRoom._id}/messages`, {
                    message,
                    sender: currentUser,
                });
                // Optionally, emit the message via socket if needed:
                socket.current.emit('group_message', response.data);
                setMessages((prev) => [...prev, response.data]);
                setMessage('');
            } catch (error) {
                console.error('Error sending group message:', error);
            }
        }
    };

    // Join a group and fetch messages
    const joinRoom = async (groupId) => {
        // Find the group object from the groups array
        const groupObj = groups.find((g) => g._id === groupId);
        if (!groupObj) {
            console.error('Group not found');
            return;
        }
        setSelectedRoom(groupObj); // Store the entire group object
        socket.current.emit('join_group', groupId);

        try {
            const response = await axios.get(`http://localhost:7000/api/group_messages/${groupId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching group messages:', error);
        }
    };

    // Leave the group
    const leaveRoom = () => {
        if (selectedRoom) {
            socket.current.emit('leave_group', selectedRoom._id);
            setSelectedRoom(null);
            setMessages([]);
        }
    };

    // Open private chat
    const openPrivateChat = async (username) => {
        setSelectedUser(username);
        setMessages([]);

        try {
            const response = await axios.get(`http://localhost:7000/api/private_messages/${currentUser}/${username}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching private messages:', error);
        }
    };

    return (
        <div className="dashboard-container flex h-screen">
            {/* Room List */}
            <div className="room-list w-1/4 bg-gray-800 border-r-2 border-white text-white p-4 h-full overflow-y-auto">
                <h3 className="text-lg font-bold hover:scale-105 hover:cursor-pointer">Rooms</h3>
                <ul>
                    {groups.map((group) => (
                        <li
                            key={group._id}
                            className="my-2 cursor-pointer hover:bg-slate-600 rounded-md"
                            onClick={() => joinRoom(group._id)}
                        >
                            {group.name}
                        </li>
                    ))}
                </ul>
                <hr className="my-4 py-2" />
                <h3 className="text-lg font-bold hover:scale-105 hover:cursor-pointer">Friends</h3>
                <ul>
                    {users.map((user, index) => (
                        <li
                            key={index}
                            className="my-2 cursor-pointer hover:bg-slate-600 rounded-md"
                            onClick={() => openPrivateChat(user.username)}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Area */}
            <div className="chat-area w-3/4 p-4 bg-stone-950 h-full flex flex-col">
                <h2 className="text-2xl font-extrabold text-white">Chat</h2>

                {selectedRoom && (
                    <div className="room-info flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white mt-2">
                            Room: {selectedRoom.name}
                        </h3>
                        <button
                            className="text-sm text-white bg-red-700 rounded-md py-2 w-40 border-white border-2 hover:bg-red-800 hover:scale-105 font-bold"
                            onClick={leaveRoom}
                        >
                            Leave Room
                        </button>
                    </div>
                )}

                {selectedUser && !selectedRoom && (
                    <div className="user-info mb-4">
                        <h3 className="text-lg text-white mt-2 font-semibold">
                            Chatting with: {selectedUser}
                        </h3>
                    </div>
                )}

                <div className="messages-container my-4 flex-1 overflow-y-auto bg-purple-400 rounded-xl border-4 border-white shadow-md shadow-black">
                    {messages.length === 0 && (
                        <p className="text-lg font-bold ml-2 mt-2">
                            No messages yet. Start chatting!
                        </p>
                    )}
                    {messages.map((msg, index) =>
                        msg.message && (
                            <div
                                key={index}
                                className={`message bg-white rounded-e-sm border-2 border-black max-w-max mt-2 ml-2 rounded-b-md
                                ${msg.sender === currentUser ? 'sent' : 'received'}`}
                            >
                                <strong>{msg.from_user || msg.sender}:</strong> {msg.message}
                                <span className="text-sm text-gray-500 ml-2 flex flex-col">
                                    {new Date(msg.date_sent).toLocaleString()}
                                </span>
                            </div>
                        )
                    )}
                    {typingUser && (
                        <div className="typing-indicator text-gray-500">
                            {typingUser} is typing...
                        </div>
                    )}
                </div>

                <div className="message-input mt-4 border-4 border-white rounded-lg bg-purple-600 py-4">
                    <input
                        type="text"
                        className="w-11/12 mr-3 p-2 rounded-md ml-2 border-2 border-black border-b-4 border-r-4"
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleTyping}
                    />
                    <button
                        className="send-button mt-2 py-2 px-3 bg-black border-2 border-white border-b-2 hover:bg-orange-600 hover:scale-105 rounded-md text-white"
                        onClick={selectedRoom ? sendGroupMessage : sendPrivateMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
