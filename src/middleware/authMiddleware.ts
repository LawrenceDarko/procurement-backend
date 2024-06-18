import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Role from '../models/Role';

interface JwtPayload {
    userId: string;
    exp: any
}

interface AuthenticatedRequest extends Request {
    user?: IUser | any; // Use the IUser interface here
}

export const protect = (permissions: string[] = []) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            const user = await User.findById(decoded.userId).populate('role');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            const userRole = user.role as any;
            const userPermissions = userRole.permissions;

            // Check for Administrator Access
            if (userPermissions.AdministratorAccess.includes('all')) {
                req.user = await User.findById(decoded.userId).select('-password');;
                return next();
            }

            for (const permission of permissions) {
                const [module, access] = permission.split(':');
                if (!userPermissions[module] || !userPermissions[module].includes(access)) {
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



