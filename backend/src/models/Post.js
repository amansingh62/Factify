// Imported required packages
const mongoose = require("mongoose");

// Schema for post creation
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        trim: true
    },

    image: {
        type: String
    },

    video: {
        type: String
    },

    upvotes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    flags: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
            text: { type: String, trim: true },
            createdAt: { type: Date, default: Date.now },
        }
    ],
}, { timestamps: true });

// Exported the postschema model
module.exports = mongoose.model("Post", postSchema);