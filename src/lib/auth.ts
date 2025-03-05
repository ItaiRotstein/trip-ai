import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
        return null;
    }
}; 