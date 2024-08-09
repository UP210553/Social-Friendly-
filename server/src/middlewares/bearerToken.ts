import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../keys';

export function authToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Invalid Token Prefix');
            return res.status(401).json({ message: 'Invalid Token Prefix' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Authentication Error' });
        }

        console.log('Token:', token);
        const user = jwt.verify(token, JWT_SECRET) as User;

        req.user = { ...user };

        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            console.error('Invalid Token:', (error as jwt.JsonWebTokenError).message);
            return res.status(403).json({ message: 'Invalid Token!' });
        }
        console.error('Error:', (error as Error).message);
        return res.status(400).json({ message: 'Error in the files' });
    }
}

export interface User extends JwtPayload {
    id: string | number;
}
