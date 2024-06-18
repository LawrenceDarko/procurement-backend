import express from 'express';
import http from 'http';
const mongoose = require('mongoose');

import userRoutes from './routes/userRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import protect from './middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));



app.use('/api/user', userRoutes);
// app.use('/api/workspace', protect, workspaceRoutes);
// app.use('/api/channels', protect, channelRoutes);
// app.use('/api/direct-chat', protect, directChatRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(process.env.PORT, () => {
        console.log('Connected to DB');
        console.log('Server running on port', process.env.PORT);
    });
}).catch((error: any) => {
    console.log('db connect error:', error.message);
});