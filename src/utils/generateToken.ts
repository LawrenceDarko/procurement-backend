import jwt from 'jsonwebtoken';

export const generateToken = (userId: any, role: string): string => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};
