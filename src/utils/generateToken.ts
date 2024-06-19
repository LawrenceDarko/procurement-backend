import jwt from 'jsonwebtoken';

export const generateToken = (userId: any, role: string): any => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
        expiresIn: '24h',
    });
};
