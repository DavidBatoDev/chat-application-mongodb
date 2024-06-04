import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';
import { errorHandler } from './errorHandler.js';

export const authorizationHandler = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(errorHandler(401, 'Not authorized'));
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            return next(errorHandler(401, 'Not authorized'));
        }
        req.user = user;
        next()
    } catch (error) {
        next(error);
    }
}