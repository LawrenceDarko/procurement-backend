import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';
dotenv.config();


interface JwtPayload {
    userId: string;
    exp: any
    role: string;
}

// Define a new type that extends the existing Request type and includes the 'user' property
interface AuthenticatedRequest extends Request {
    user?: IUser | any; // Use the IUser interface here
}



export const protect = (roles: string[] = []) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            if(decoded.exp * 1000 < Date.now()){
                // return res.status(401).json({message: 'Token expired'})
                res.redirect(`${process.env.FRONTEND_URL}/get-started/find`)
            }
    
            if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Forbidden' });
            }
    
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    };
};

export default protect