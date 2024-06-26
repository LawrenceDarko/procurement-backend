const mongoose = require('mongoose');
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { protect } from './middleware/authMiddleware';
import authRoutes from './routes/authRoutes';
import bodyParser from 'body-parser';
import departmentRoutes from './routes/departmentRoutes';
import { getOrganizationRoles } from './controllers/rolesController';

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: ['http://localhost:3000', 'https://e-procurement.surge.sh'],
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/images", express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.get('/api/roles/:organizationId', protect(['superadmin', 'admin']), getOrganizationRoles);


mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(process.env.PORT, () => {
        console.log('Connected to DB');
        console.log('Server running on port', process.env.PORT);
    });
}).catch((error: any) => {
    console.log('db connect error:', error.message);
});