// imports
import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth-routes.js'
import userRoutes from './routes/user-routes.js'
import chatRoutes from './routes/chat-routes.js'
import messageRoutes from './routes/message-routes.js'
import cors from 'cors';

// constants
dotenv.config()
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGODB_URI;

//middlewares
app.use(cors({
    origin: '*'
}));
app.use(express.json());

mongoose.connect(DB_URI).then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.log('Error connecting to database', error);
});

// routers
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// error handler
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || 'Internal server error';
    res.status(error.statusCode).json({
        success: false,
        errorMsg: error.message
    });
})

// listen
const server = app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
})

// socket.io
const io = new Server(server, {
    cors: {
        origin: '*'
    },
    pingTimeout: 60000,
});

io.on('connection', (socket) => {
    socket.on('setup', (user) => {
        socket.join(user.data._id)
        socket.emit('connected')
    })

    socket.on('join chat', (chatId) => {
        console.log('joining chat ', chatId)
        socket.join(chatId)
    })

    socket.on('new message', async (messageStatus) => {
        let chat = messageStatus.chat
        if (!chat.users) return console.log('users not found')
        try {
            // // option 1
            // for (const user of chat.users) {
            //     if (user._id.toString() !== messageStatus.sender._id.toString()) {
            //         console.log('emmiting message to', user.name, 'in', chat.chatName == 'sender' ? user.name : chat.chatName)
            //         socket.in(user._id).emit('message received', messageStatus);
            //     }
            // }
            // // option 2
            console.log('emmiting message to', chat.chatName)
            socket.in(chat._id).emit('message received', messageStatus);
        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        socket.rooms.forEach(room => {
            socket.leave(room);
        });
    });
})
