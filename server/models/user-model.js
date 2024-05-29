import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    chatRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
    ]
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);
export default User;