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
        message: error.message
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

app.set('socketio', io);

io.on('connection', (socket) => {
    socket.on('setup', (user) => {
        if (user?.data?._id) {
            socket.join(user.data._id);
            socket.emit('connected');
            console.log(`User ${user.data._id} connected and joined their room.`);
        } else {
            console.error('User data is missing or malformed:', user);
            socket.emit('error', { message: 'Invalid user data for setup.' });
        }
    });

    socket.on('join chat', (chatId) => {
        console.log('joining chat ', chatId)
        socket.join(chatId)
    })

    socket.on('leave chat', (chatId) => {
        console.log('leaving chat ', chatId);
        socket.leave(chatId);
    });

    socket.on('new message', async (messageStatus) => {
        let chat = messageStatus.chat
        if (!chat.users) return console.log('users not found')
        try {
            // sending to individual users who are part of the chat
            // socket.emit('message received', messageStatus);
            // sending to all users in chat room
            io.to(chat._id).emit('message received', messageStatus);
            for (const user of chat.users) {
                io.to(user._id).emit('update message', messageStatus);
                io.to(user._id).emit('sort convo', messageStatus);
                io.to(user._id).emit('update latest', messageStatus);
            }

        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })

    // when a user joins a group
    socket.on('join group', async (data) => {
        try {
            console.log('server 108 join group', data)
            io.to(data.userId).emit('new chat', data.groupChat);
        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })

    // when a user leaves a group
    socket.on('leave group', async (data) => {
        try {
            console.log('server 120 leave group', data)
            io.to(data.userId).emit('delete chat', data.chat);
        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })
        

    socket.on('new chat', async (chat) => {
        console.log('new chat', chat)
        try {
            for (const user of chat.users) {
                io.to(user._id).emit('new chat', chat);
            }
        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })

    // when a user was added to a chat
    socket.on('add chat to user', async (data) => {
        try {
            for (const user of data.users) {
                io.to(user).emit('enable chat', data.chat);
                io.to(user).emit('new chat', data.chat);
            }
        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })

    // when a chat was deleted
    socket.on('delete chat', async (chat) => {
        try {
            for (const user of chat.users) {
                io.to(user).emit('delete chat', chat);
            }
        } catch (error) {
            console.log(error)
            socket.emit('error', {message: 'Error sending message'})
        }
    })

    // when a user was removed from a chat
    socket.on('remove chat to user', async (data) => {
        try {
            for (const user of data.users) {
                io.to(user).emit('disabled chat', data.chat);
                io.to(user).emit('delete chat', data.chat);
            }
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
