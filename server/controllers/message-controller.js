import Chat from "../models/chat-model.js"
import User from "../models/user-model.js"
import Message from "../models/message-model.js"
import { errorHandler } from "../utils/errorHandler.js"

export const sendMessage = async (req, res, next) => {
    const currentUserId = req.user._id
    const {content, chatId} = req.body
    try {
        if (!currentUserId) {
            next(errorHandler(400, "Not authorized"))
        }
        if (!content || !chatId) {
            return next(errorHandler(400, "Data is not sufficient"))
        }
        const chat = await Chat.findById(chatId)
        const recipients = chat.users.filter(id => currentUserId.toString() != id.toString())
        const newMessage = new Message({
            chat: chatId,
            sender: currentUserId,
            reciever: recipients
        })
        let message = await newMessage.save()
        message = await message
            .populate("sender", "name")
            .populate('receiver')
            .populate('chat')
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email"
        })
        await Chat.findByIdAndUpdate(chatId, {latestMessage: message})
        res.status(200).json(message)
    } catch (error) {
        next(error)
    }
}

export const fetchMessages = async (req, res, next) => {
    const {chatId} = req.params
    try {
        let messages = await Message.find({chat: chatId})
            .populate("chat")
            .populate("sender", "name")
            .populate('receiver')

        messages = await Chat.populate(messages, {
            path: "chat",
            populate: {
                path: "users",
                select: "name email"
            }
        })

        res.status(200).json(messages)
    } catch (error) {
        next(error)
    }
}