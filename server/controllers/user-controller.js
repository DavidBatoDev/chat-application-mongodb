import User from '../models/user-model.js'

export const fetchAllUsers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const users = await User.find({ _id: { $ne: req.user._id } });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}