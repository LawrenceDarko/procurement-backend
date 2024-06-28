const mongoose = require('mongoose');
import cors from 'cors';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';
import { protect } from './middleware/authMiddleware';
import departmentRoutes from './routes/departmentRoutes';
import itemCategoryRoutes from './routes/itemCategoryRoutes';
import itemSubCategoryRoutes from './routes/itemSubCategoryRoutes';
import { getOrganizationRoles } from './controllers/rolesController';
import budgetRoutes from './routes/budgetRoutes';
import budgetFileTemplateRoutes from './routes/budgetFileTemplateRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: ['http://localhost:3000', 'http://e-procurement.surge.sh'],
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/uploads", express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/item-categories', itemCategoryRoutes);
app.use('/api/item-subcategories', itemSubCategoryRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/budget-file-templates', budgetFileTemplateRoutes); 
app.get('/api/roles/:organizationId', protect(['superadmin', 'admin']), getOrganizationRoles);


mongoose.connect(process.env.MONGO_URI).then(() => {
    server.listen(process.env.PORT, () => {
        console.log('Connected to DB');
        console.log('Server running on port', process.env.PORT);
    });
}).catch((error: any) => {
    console.log('db connect error:', error.message);
});