// Imported required packages
const mongoose = require("mongoose");

// Designed user schema model
const userSchema = new mongoose.Schema({
     name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },

    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true, 
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6
    },

    role: {
        type: String,
        default: "user"
    },
    refreshToken: { 
        type: String
    },

    bio: {
        type: String,
        trim: true,
        default: ""
    },

    profilePic: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Exported the user schema model
module.exports = mongoose.model("User", userSchema);