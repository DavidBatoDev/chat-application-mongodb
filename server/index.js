// imports
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth-routes.js'
import cors from 'cors';

// constants
dotenv.config()
const app = express();
const PORT = process.env.PORT || 5002;
const DB_URI = process.env.MONGODB_URI;

//middlewares
app.use(cors());
app.use(express.json());

mongoose.connect(DB_URI).then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.log('Error connecting to database', error);
});


// listen
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
})

// routers
app.use('/api/auth', authRoutes);

// error handler
app.use((error, req, res, next) => {
    if (!error.statusCode) {
        error.statusCode = 500;
    }
    if (!error.message) {
        error.message = 'Internal server error';
    }
    res.status(error.statusCode).json({
        error: error.message
    });
})