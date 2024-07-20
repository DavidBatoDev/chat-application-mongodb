import User from '../models/user-model.js'
import Chat from '../models/chat-model.js'
import { errorHandler } from '../utils/errorHandler.js';

export const fetchUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const fetchOtherUser = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!req.user) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

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
        const groups = await Chat.find({isGroupChat:true, users: req.user._id}).populate('users');
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const fetchRelatedUsers = async (req, res, next) => {
    const currentUserId = req.user._id;
    try {
        if (!currentUserId) {
            return next(errorHandler(401, 'Unauthorized'));
        }
        const chats = await Chat.find({users: currentUserId})
            .populate('users');
        if (chats.length === 0) {
            return res.status(200).json([]);
        }
        const relatedUsers = [];
        chats.forEach(chat => {
            chat.users.forEach(user => {
                if (user._id.toString() !== currentUserId.toString() && !relatedUsers.includes(user)) {
                    relatedUsers.push(user);
                }
            });
        });
        res.status(200).json(relatedUsers);
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        if (req.user._id.toString() !== userId.toString()) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                name: req.body.name,
                aboutMe: req.body.aboutMe,
                profilePic: req.body.profilePic,
                socials: req.body.socials
            }
        }, {new: true});
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}