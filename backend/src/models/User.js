// Imported required packages
const mongoose = require("mongoose");

// Designed user schema model
const userSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

// Exported the user schema model
module.exports = mongoose.model("User", userSchema);