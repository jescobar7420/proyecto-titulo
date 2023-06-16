import { Request, Response } from 'express';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
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
            await UserModel.resetTokenUser(user.id_usuario);
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

export const recoverPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const token = uuidv4();
        await UserModel.storeUserToken(user.id_usuario, token);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Recuperación de contraseña',
            text: `Para recuperar tu contraseña, por favor ingresa este código en la página de recuperación de contraseña: ${token}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: 'Recovery email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyResetToken = async (req: Request, res: Response) => {
    const { email, token } = req.body;
    if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
    
        const storedToken = await UserModel.getResetToken(email);
        if (storedToken.reset_token !== token) {
            return res.status(400).json({ error: 'Invalid token' });
        }
        res.status(200).json({ status: 'Token verified' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }    
};

export const resetPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updatePassword(email, hashedPassword);
    res.status(200).json({ status: 'Password updated' });
};