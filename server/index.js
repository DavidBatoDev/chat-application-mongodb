import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT

app.use('/', (req, res) => {
    res.send('API is working');
})

app.listen(PORT, () => {
    console.log('Server is running on port ', PORT);
})