import Chat from '../models/chat-model.js'
import Message from '../models/message-model.js'
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
            select: 'name email profilePic'
        })
        res.status(200).json(chat)
    } catch (error) {
        next(error)
    }
}

export const fetchChatById = async (req, res, next) => {
    const chatId = req.params.chatId
    const userId = req.user._id
    try {
        if (!chatId) {
            return next(errorHandler(400, 'Chat ID is required'))
        }
        if (!userId) {
            return next(errorHandler(400, 'Not Authorized'))
        }
        let chat = await Chat.findOne({_id: chatId})
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
        if (!chat) {
            return next(errorHandler(404, 'Chat not found'))
        }
        chat = await User.populate(chat, {
            path: 'latestMessage.sender',
            select: 'name email profilePic'
        })
        res.status(200).json(chat)
    } catch (error) {
        next(error)
    }
}

export const fetchChat = async (req, res, next) => {
    const {userId} = req.params
    const currentUserId = req.user._id
    let isNewChat = false // for socket.io

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
        const chat = chats[0]
        return res.status(200).json({chat, isNewChat})
    }
    isNewChat = true
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
            res.status(200).json({chat, isNewChat})
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
    const currentUserId = req.user._id
    const { groupId } = req.params

    const user = await User.findById(currentUserId)

    if (!user) {
        return next(errorHandler(400, "User not found'"))
    }

    if (!groupId) {
        return next(errorHandler(400, "Group ID is required"))
    }

    try {
        const groupChat = await Chat.findOne({_id: groupId})

        if (!groupChat) {
            return res.status(404).json({message: 'Group Chat not found'})
        }

        const groupUsers = groupChat.users.filter(id => currentUserId.toString() !== id.toString())

        groupChat.users = groupUsers
        
        const recipients = groupChat.users.filter(id => currentUserId.toString() != id.toString())
        const newMessage = new Message({
            chat: groupChat._id,
            sender: currentUserId,
            reciever: recipients,
            content: `${user.name} has left the group`
        })
        let message = await newMessage.save()
        message = await Message.findById(message._id)
            .populate("sender", "name")
            .populate({
                path: 'chat',
                populate: {
                    path: 'users',
                    select: 'name email'
                }
            });
        message = await User.populate(message, {
            path: 'reciever',
            select: 'name email'
        })
        
        await Chat.findByIdAndUpdate(groupChat._id, {latestMessage: message})
        await groupChat.save()

        console.log(`Emitting remove chat event for user ${currentUserId} and chat ${groupChat._id}`);

        res.status(200).json({chat: groupChat, message: message, userId: currentUserId})
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

        if (groupChat.users.map(user => user.toString()).includes(currentUserId.toString())) {
            return res.status(400).json({message: "You're already a member of this group"})
        }
        const added = await Chat.findByIdAndUpdate(groupId, {
            $push: {users: currentUserId}
        }, {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        res.status(200).json(added)
    } catch (error) {
        next(error)
    }
}

export const deleteGroup = async (req, res, next) => {
    const groupId = req.params.groupId
    const currentUserId = req.user._id
    try {
        if (!groupId) {
            return next(errorHandler(400, "Group ID is required"))
        }
        const groupChat = await Chat.findById(groupId)
        if (!groupChat) {
            return next(errorHandler(404, "Group chat not found"))
        }
        if (groupChat.groupAdmin.toString() !== currentUserId.toString()) {
            return next(errorHandler(401, "You're not the group admin"))
        }
        await Chat.findByIdAndDelete(groupId)
        await Message.deleteMany({chat: groupId})
        res.status(200).json({chat: groupChat, message: "Group chat deleted successfully"})
    } catch (error) {
        next(error)
    }
}

export const updateGroup = async (req, res, next) => {
    const {groupId} = req.params
    const {chatName ,chatImage, users} = req.body
    const currentUserId = req.user._id
    try {
        if (!groupId) {
            return next(errorHandler(400, "Group ID is required"))
        }
        const groupChat = await Chat.findById(groupId)
        if (!groupChat) {
            return next(errorHandler(404, "Group chat not found"))
        }
        if (groupChat.groupAdmin.toString() !== currentUserId.toString()) {
            return next(errorHandler(401, "You're not the group admin"))
        }
        const usersThatIsRemoved = groupChat.users.toString().split(',').filter(user => !users.includes(user))
        if (usersThatIsRemoved.includes(currentUserId)) {
            return next(errorHandler(401, "You can't remove yourself from the group"))
        }
        const usersThatIsAdded = users.filter(user => !groupChat.users.includes(user))
        groupChat.chatName = chatName
        groupChat.chatImage = chatImage
        groupChat.users = users
        await groupChat.save()
        res.status(200).json({chat: groupChat, usersThatIsRemoved, usersThatIsAdded})
    } catch (error) {
        next(error)
    }
}