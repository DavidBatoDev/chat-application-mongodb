import express from 'express';

const app = express();
const PORT = 5002;

app.listen(5002, () => {
    console.log('Server is running on port ', PORT);
})