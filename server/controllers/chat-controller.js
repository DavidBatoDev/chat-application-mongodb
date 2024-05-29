import Chat from '../models/chat-model.js'
import User from '../models/user-model.js'
import { errorHandler } from '../utils/errorHandler.js'

export const fetchChats = async (req, res, next) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return next(errorHandler(400, 'Not Authorized'))
        }
        Chat.find({users:{ $elemMatch: {userId}}})
            .populate('users', '-password')
            .populate('groupAdmins', '-password')
            .populate('latestMessage')
            .sort({updatedAt: -1})
            .then(async (chats) => {
                chats = await User.populate(chats, {
                    path: 'latestMessage.sender',
                    select: 'name email'
                })
                res.status(200).json(chats)
            })
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

    const chats = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: { $elemMatch: {userId}}}, // find chat with user
            {users: { $elemMatch: {$eq: currentUserId}}}, // find chat with current user
        ] 
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

export const fetchGroups = async (req, res, next) => {
    try {
        const currentUser = req.user._id
        if (!currentUser) {
            next(errorHandler(400, "Not authorized!"))
        }
        const groupChats = await Chat.find({
            isGroupChat: true, 
            $and: [
                {users: {$elemMatch: {$eq: currentUser._id}}}
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

export const createGroup = async (req, res) => {
    const {usersToBeAdded, groupName} = req.body

    if (!usersToBeAdded || !groupName) {
        next(errorHandler(400, "Data is no suffiecient"))
    }

    const users = JSON.parse(usersToBeAdded)
    users.push(req.user._id)

    try {
        const groupChat = new Chat({
            name: groupName,
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

export const leftGroup = async (req, res) => {
    const {groupId} = req.params
    const {userId} = req.body

    if (!groupId) {
        next(errorHandler(400, "Group ID is required"))
    }

    try {
        const groupChat = await Chat.findOne({_id: groupId})

        if (!groupChat) {
            return res.status(404).json({message: 'Group Chat not found'})
        }

        const groupUsers = groupChat.users

        if (groupUsers.includes(userId)) {
            groupUsers.splice(groupUsers.indexOf(userId), 1)
        }

        groupChat.users = groupUsers
        await groupChat.save()

        res.status(200).json(groupChat)
    } catch (error) {
        next(error)
    }
}
