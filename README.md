
# Enigma Chat Web Application

This chat application allows users to sign up, log in, and chat in real-time via private messages or within groups (rooms). It is built with a Node.js backend using Express, Mongoose (for MongoDB), and Socket.io for real-time communication. The front end is built with React and styled using Tailwind CSS.

## Features

- **User Authentication:**
  - **Signup:** Create a new account with a unique username.
  - **Login:** Authenticate and start a user session.
  - **Logout:** Clear the session and return to the login page.
- **Real-time Chat:**
  - **Private Chat:** One-to-one messaging with typing indicators.
  - **Group Chat:** Join a room (group) and chat with multiple users.
  - **Typing Indicator:** Display when the other user is typing.
- **Data Persistence:**
  - All messages (private and group) are stored in MongoDB for future retrieval.
  - Groups are stored with their members and associated messages.
- **Responsive UI:**
  - The frontend is built with React and styled with Tailwind CSS.
  - Navigation updates dynamically based on the user's authentication state.

## Technologies Used

- **Backend:**
  - Node.js
  - Express
  - MongoDB with Mongoose
  - Socket.io
- **Frontend:**
  - React
  - Tailwind CSS
  - Axios (for API requests)
  - React Router DOM
  - React Toastify (for notifications)

## Installation

### Prerequisites

- Node.js (LTS version recommended)
- MongoDB (local installation or a hosted service such as MongoDB Atlas)
- npm (comes with Node.js)

### Backend Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/your-chat-app.git
   cd your-chat-app/backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env` file in the backend folder with the following:

   ```
   PORT=7000
   MONGO_URI=your-mongodb-connection-string
   ```

4. **Run the Backend Server:**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:7000`.

### Frontend Setup

1. **Navigate to the Frontend Folder:**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Frontend Application:**

   ```bash
   npm start
   ```

   The React app will run on `http://localhost:3000`.

## API Endpoints

### User Authentication

- **Login:**
  - Endpoint: `POST /api/auth/login`
  - Request Body:
    ```json
    {
      "username": "yourUsername",
      "password": "yourPassword"
    }
    ```

- **Signup:**
  - Endpoint: `POST /api/auth/signup`
  - Request Body:
    ```json
    {
      "username": "yourUsername",
      "firstname": "FirstName",
      "lastname": "LastName",
      "email": "email@example.com",
      "password": "yourPassword"
    }
    ```

- **Get All Users:**
  - Endpoint: `GET /api/auth/all_users`

### Group Routes

- **Create a Group:**
  - Endpoint: `POST /api/groups/create`
  - Request Body:
    ```json
    {
      "name": "GroupName",
      "members": ["user1", "user2", "user3"]
    }
    ```

- **Get All Groups:**
  - Endpoint: `GET /api/groups`

- **Update Group Members:**
  - Endpoint: `PUT /api/groups/:groupId/members`
  - Request Body:
    ```json
    {
      "action": "add", // or "remove"
      "memberId": "userObjectId"
    }
    ```

### Group Messages

- **Fetch Group Messages:**
  - Endpoint: `GET /api/group_messages/:groupId/messages`

- **Send a Group Message:**
  - Endpoint: `POST /api/group_messages/:groupId/messages`
  - Request Body:
    ```json
    {
      "message": "Your message here",
      "sender": "yourUsername"
    }
    ```

### Private Messages

- **Fetch Private Messages:**
  - Endpoint: `GET /api/private_messages/:sender/:receiver`

### Real-time Communication with Socket.io

The application uses Socket.io for real-time messaging. Key socket events include:

- **register:** Registers a user upon socket connection.
- **privateMessage:** Sends/receives private messages.
- **group_message:** Sends/receives group messages.
- **join_group:** User joins a group room and fetches message history.
- **typing and stopTyping:** Typing indicator events in private chat.

## UI Overview

### Navigation Bar

- Displays links for Home, Login, Signup, Dashboard, and Logout.
- The logout link is rendered only when a user is logged in.

### Dashboard

- **Left Sidebar:** Lists available groups (fetched dynamically from MongoDB) and friends.
- **Chat Area:** Displays messages (either private or group), a message input field, and a typing indicator.
- In group chat mode, the room's name is shown instead of its ID.

### Logout Functionality

- The Logout component clears the user session from `localStorage`, updates the authentication context, and redirects to the login page.

## Running the Application

1. **Start the Backend Server:**

   ```bash
   npm start
   ```

2. **Start the Frontend Application:**

   ```bash
   npm start
   ```

3. **Navigate to `http://localhost:7000` in your browser.**

## Future Improvements

- Implement JWT-based authentication for enhanced security.
- Add more detailed error handling and user feedback.
- Enhance the user interface with additional features like online status and message read receipts.
- Extend functionality to support media uploads and message editing.

## License

This project is licensed under the MIT License.
