import Chat from '../models/chat-model.js'
import User from '../models/user-model.js'
import { errorHandler } from '../utils/errorHandler.js'
import mongoose from 'mongoose'

export const fetchChats = async (req, res, next) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return next(errorHandler(400, 'Not Authorized'))
        }
        let chat = await Chat.find({users: { $elemMatch: { $eq: userId }}})
            .populate('users', '-password')
            .populate('latestMessage')
            .sort({updatedAt: -1})
        if (!chat) {
            return res.status(404).json({message: 'Chats not found'})
        }
        chat = await User.populate(chat, {
            path: 'latestMessage.sender',
            select: 'name email'
        })
        res.status(200).json(chat)
    } catch (error) {
        next(error)
    }
}

export const fetchChat = async (req, res, next) => {
    const {userId} = req.params
    const currentUserId = req.user._id

    if (!userId) { // check if userId is provided
        return next(errorHandler(400, 'User ID is required'))
    }
    if (!currentUserId) { // check if currentUser is defined
        return next(errorHandler(400, 'Not Authorized'))
    }
    let chats = await Chat.find({
        isGroupChat: false,
        users: { $all: [userId, currentUserId] }
    })
        .populate('users', "-password") // exclude password field
        .populate('latestMessage') // populate latestMessage field
    if (!chats) {
        return res.status(404).json({message: 'Chats not found'})
    }
    chats = await User.populate(chats, { // populate sender field
        path: "latestMessage.sender",
        select: "name email"  
    })
    if (chats.length > 0) { // if chat is found
        return res.status(200).json(chats[0])
    }
    const newChat = new Chat({ // create new chat
        chatName: "sender",
        users: [currentUserId, userId],
        isGroupChat: false
    })
    newChat.save() // create a new chat
        .then(async (chat) => {
            chat = await User.populate(chat, {
                path: 'users',
                select: '-password'
            })
            res.status(200).json(chat)
        })
        .catch((error) => {
            next(error)
        })
}

export const fetchUserGroups = async (req, res, next) => {
    try {
        const currentUserId = req.user._id
        if (!currentUserId) {
            return next(errorHandler(400, "Not authorized!"))
        }
        const groupChats = await Chat.find({
            isGroupChat: true, 
            $and: [
                {users: {$elemMatch: {$eq: currentUserId}}}
            ]
        })
            .populate('users', "-password")
            .populate('latestMessage')

        if (!groupChats) {
            return res.status(404).json({message: 'No Group Chats found'})
        }

        groupChats = await User.populate(groupChats, {
            path: 'latestMessage.sender',
            select: 'name email'
        })
        res.status(200).json(groupChats)
    } catch (error) {
        next(error)
    }
}

export const createGroup = async (req, res, next) => {
    const {usersToBeAdded, groupName} = req.body

    if (!usersToBeAdded || !groupName) {
        return next(errorHandler(400, "Data is no sufficient"))
    }

    const users = [...usersToBeAdded, req.user._id]


    try {
        const groupChat = new Chat({
            chatName: groupName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        })

        await groupChat.save()

        const populatedGroupChat = await Chat.findOne({_id: groupChat._id})
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        res.status(200).json(populatedGroupChat)

    } catch (error) {
        next(error)
    }    
}

export const leftGroup = async (req, res, next) => {
    const {groupId} = req.params
    const {userId} = req.body.id

    if (!groupId) {
        return next(errorHandler(400, "Group ID is required"))
    }

    try {
        const groupChat = await Chat.findOne({_id: groupId})

        if (!groupChat) {
            return res.status(404).json({message: 'Group Chat not found'})
        }

        const groupUsers = groupChat.users.filter(id => userId.toString() !== id.toString())

        groupChat.users = groupUsers
        await groupChat.save()

        res.status(200).json(groupChat)
    } catch (error) {
        next(error)
    }
}

export const addGroupMember = async (req, res, next) => {
    const currentUserId = req.user._id
    const {userId, groupId} = req.body
    try {
        if (!currentUserId) {
            return next(errorHandler("400", "Not Authorized!"))
        }
        if (!userId || !groupId) {
            return next(errorHandler(400, "Data is not sufficient!"))
        }
        const groupChat = await Chat.findOne({_id: groupId})
        if (!groupChat) {
            return next(errorHandler(404, "Group chat not found!"))
        }
        const groupAdmins = groupChat.groupAdmin

        if (groupAdmins.map(admin => admin.toString()).includes(currentUserId.toString())) {
            const added = await Chat.findByIdAndUpdate(
                groupId,
                {$push: {users: mongoose.Types.ObjectId(userId)}},
                {new: true}
            )
            res.status(200).json(added)
        } else {
            return res.status(401).json({message: "You're not a groupAdmin"})
        }
    } catch (error) {
        next(error)
    }
}

export const joinGroup = async (req, res, next) => {
    const currentUserId = req.user._id
    const groupId = req.params.groupId
    try {
        if (!currentUserId) {
            return next(errorHandler(400, "Not Authorized!"))
        }
        const groupChat = await Chat.findById(groupId)
        if (!groupChat) {
            return next(errorHandler(404, "Group chat not found!"))
        }
        const added = await Chat.findByIdAndUpdate(groupId, {
            $push: {users: mongoose.Types.ObjectId(currentUserId)}
        }, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        res.status(200).json(added)
    } catch (error) {
        next(error)
    }
}