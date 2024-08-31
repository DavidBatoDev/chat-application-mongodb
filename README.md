# Chat Application

This project is a full-featured chat application built with the MERN stack (MongoDB, Express, React, Node.js). It supports personal and group chats, real-time messaging, user authentication, and more.

## Features

- **Authentication**: Users can sign up, log in, and log out securely.
- **Personal Chat**: One-on-one messaging with other users.
- **Group Chat**: Users can create and participate in group chats.
- **Profile Info Page**: Users can view and edit their profile information.
- **Group Chat Info Page**: Group creators can edit group chat details.
- **Real-time Chat**: Real-time messaging powered by Socket.io.
- **Image Upload**: Users can upload images in chats using Firebase storage.

## Tech Stack

- **Frontend**: React, Redux, Material-UI, Firebase
- **Backend**: Node.js, Express, MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Token)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Firebase account for image storage

### Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/chat-application.git
    cd chat-application
    ```

2. **Install dependencies:**

    - Frontend:

      ```bash
      cd frontend
      npm install
      ```

    - Backend:

      ```bash
      cd backend
      npm install
      ```

3. **Set up environment variables:**

    Create a `.env` file in the `backend` directory and add the following:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    FIREBASE_API_KEY=your_firebase_api_key
    FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    FIREBASE_APP_ID=your_firebase_app_id
    ```

4. **Run the application:**

    - Backend:

      ```bash
      cd backend
      npm start
      ```

    - Frontend:

      ```bash
      cd frontend
      npm start
      ```

5. **Access the application:**

    Open your browser and navigate to `http://localhost:3000`.

## Dependencies

### Frontend

```json
"dependencies": {
  "@emotion/react": "^11.11.4",
  "@emotion/styled": "^11.11.5",
  "@mui/icons-material": "^5.15.17",
  "@mui/material": "^5.15.17",
  "@reduxjs/toolkit": "^2.2.4",
  "axios": "^1.6.8",
  "clsx": "^2.1.1",
  "firebase": "^10.12.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^5.3.0",
  "react-redux": "^9.1.2",
  "react-router-dom": "^6.23.0",
  "redux-persist": "^6.0.0",
  "socket.io-client": "^4.7.5"
}
```
### Backend:
```json
"dependencies": {
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "express": "^4.19.2",
  "express-async-handler": "^1.2.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.3.4",
  "nodemon": "^3.1.0",
  "socket.io": "^4.7.5"
}
```

## App:
### Darkmode in multiple screens:
![image](https://github.com/user-attachments/assets/54f1b741-814b-4ef3-bbfb-a3776a95a336)
![image](https://github.com/user-attachments/assets/e5f5a56b-d15a-489d-92c1-6d1b5c239a4b)

### Lightmode in multiple screens:
![image](https://github.com/user-attachments/assets/2101e2ed-8f83-4c18-bbd9-c65ecbc3d352)
![image](https://github.com/user-attachments/assets/aa1ff1f1-afe6-436a-870c-e57f8582ad14)

### Profile Page:
![image](https://github.com/user-attachments/assets/c33ae57d-5811-411b-a4b9-e8a29442438c)
![image](https://github.com/user-attachments/assets/35401397-3c5c-4219-9274-9e5fa7b65d25)

### Other User's profile:
![image](https://github.com/user-attachments/assets/0fe2be14-6108-4903-8551-f900349fa965)

### Chat Info:
![image](https://github.com/user-attachments/assets/10dbf8c2-f606-4e22-a204-5064bd434b4a)
![image](https://github.com/user-attachments/assets/500d955b-8fbc-401b-9427-665836f71674)

### Navigation page (Mobile)
![image](https://github.com/user-attachments/assets/40e8729f-ded5-4fdf-8b0f-086c91e72ca4)

### Chat Area (Mobile and Desktop):
![image](https://github.com/user-attachments/assets/9d268309-579d-419d-8b2a-2f021c8c8b8d)
![image](https://github.com/user-attachments/assets/3aa82e8e-7378-4a8f-9026-b0f26ce5d57b)

