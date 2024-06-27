import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Role from '../models/Role';

interface JwtPayload {
    userId: string;
    role: any,
    organization: any
    exp: any
}

export interface AuthenticatedRequest extends Request {
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
    
            if (roles.length > 0) {
                const userRole = await Role.findOne({ name: decoded.role });
        
                if (!userRole || !roles.includes(userRole.name)) {
                    return res.status(403).json({ message: 'Forbidden' });
                }
            }
    
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    };
};