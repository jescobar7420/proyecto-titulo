import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as UserModel from '../models/user';

const jwtSecret: string = process.env.SECRET_JWT!;

export const register = async (req: Request, res: Response): Promise<void> => {
    const user = req.body;
    if (!user.name || !user.email || !user.password) {
        res.status(400).json({ error: 'Name, email and password are required' });
        return;
    }
    try {
        const existingUser = await UserModel.getUserByEmail(user.email);
        if (existingUser) {
            res.status(400).json({ error: 'A user with this email already exists.' });
            return;
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        const newUser = await UserModel.createUser(user.name, user.email, user.password);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const user = await UserModel.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ 
                id: user.id_usuario, 
                email: user.email,
                name: user.nombre 
            }, jwtSecret, { expiresIn: '1h' }); 
            res.status(200).json({ token: token });
        } else {
            res.status(401).json({ error: 'Incorrect email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const checkAuth = async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authentication token is required' });
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtSecret); 
        const user = await UserModel.getUserById((decoded as jwt.JwtPayload).id);
        if (user) {
            res.status(200).json({ status: 'Authenticated' });
        } else {
            res.status(401).json({ error: 'Authentication failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
