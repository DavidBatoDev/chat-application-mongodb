import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        required: true,
    },
    chatImage: {
        type: String,
        default: "https://www.freeiconspng.com/uploads/user-group-flat-icon-png-24.png"
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
