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
        if (!chat) {
            return next(errorHandler(404, "Chat not found"))
        }
        const recipients = chat.users.filter(id => currentUserId.toString() != id.toString())
        const newMessage = new Message({
            chat: chatId,
            sender: currentUserId,
            reciever: recipients,
            content: content
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
        await Chat.findByIdAndUpdate(chatId, {latestMessage: message})
        res.status(200).json(message)
    } catch (error) {
        next(error)
    }
}

export const fetchMessages = async (req, res, next) => {
    const {chatId} = req.params
    try {
        if (!chatId) {
            return next(errorHandler(400, "Chat ID is required"))
        }

        let chat = await Chat.findById(chatId)

        if (!chat) {
            return next(errorHandler(404, "Chat not found"))
        }

        let messages = await Message.find({chat: chatId})
            .populate("sender", "name")

        messages = await Chat.populate(messages, {
            path: "chat",
            populate: {
                path: "users",
                select: "name email"
            }
        })

        messages = await User.populate(messages, {
            path: "reciever",
            select: "name email"
        })

        chat = await Chat.populate(chat, {
            path: "users",
            select: "name email"
        })

        res.status(200).json({messages, chat})
    } catch (error) {
        next(error)
    }
}