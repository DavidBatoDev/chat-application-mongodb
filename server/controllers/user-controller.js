import User from '../models/user-model.js'
import Chat from '../models/chat-model.js'

export const fetchUsers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const search = req.query.search || '';
        let users;
        if (search === '') {
            users = await User.find({ _id: { $ne: req.user._id } });
        } else {
            users = await User.find({ name: { $regex: search, $options: 'i' }, _id: { $ne: req.user._id } });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const fetchGroups = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const search = req.query.search || '';
        if (search !== '') {
            const groups = await Chat.find({isGroupChat: true, chatName: { $regex: search, $options: 'i' }});
            return res.status(200).json(groups);
        }
        const groups = await GroupChat.find({users: req.user._id}).populate('users');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}