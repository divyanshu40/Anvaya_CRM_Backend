const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lead",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salesAgent",
        required: true
    },
    commentText: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const comment = mongoose.model("comment", commentSchema);

module.exports = { comment };