import User from '../models/user-model.js'
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errorHandler.js';
import { generateToken } from '../utils/generateToken.js';

export const login = expressAsyncHandler( async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return next(errorHandler(400, 'User not found'));
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return next(errorHandler(400, 'Invalid password'));
    }
    const {password: dummypass, ...rest} = user._doc;
    res.status(200).json({...rest, token: generateToken(user._id)});
})

export const register = expressAsyncHandler(async (req, res, next) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }
    const userExist = await User.findOne({email});
    if (userExist) {
        return next(errorHandler(400, 'User already exist'));
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    })
    await user.save();
    res.status(201).json({message: 'User added'});
})