// imports
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// constants
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;
const DB_URI = process.env.MONGODB_URI;

// middlewares
mongoose.connect(DB_URI).then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.log('Error connecting to database', error);
});

app.use('/', (req, res) => {
    res.send('Hello World');
})

// listen
app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
})