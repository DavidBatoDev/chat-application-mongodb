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
        default: "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Download-Image.png",
    },
    aboutMe: {
        type: String,
        default: "",
    },
    socials: [
        {
            link: {
                type: String,
            },
            username: {
                type: String,
            },
            social: {
                type: String,
            },
        }
    ],
    isOnline: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;
