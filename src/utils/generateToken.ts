import jwt from 'jsonwebtoken';

export const generateToken = (userId: any, role: string, organization: any): string => {
    return jwt.sign({ userId, role, organization }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};
