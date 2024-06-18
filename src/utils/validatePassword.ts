import bcrypt from 'bcryptjs';

export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};
