import User from '../models/user-model.js'
import bcrypt from 'bcryptjs';

export const login = (req, res) => {
    const {email, password} = req.body;
    try {
        const user = User.findOne({email});
        if (!user) {
            res.status(400).json({error: 'User not found'});
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            res.status(400).json({error: 'Invalid password'});
        }
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status.send(error);
    }
}

export const register = async (req, res) => {
    const {name, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    })
    try {
        const user = User.findOne({email})
        if (user) {
            res.status(400).json({error: 'User already exists'});
        }
        await newUser.save();
        res.status(201).json({message: 'User added'});
    } catch (error) {
        res.status(400).json({error});
    }
}