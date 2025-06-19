const mongoose = require("mongoose");

const SalesAgentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const salesAgent = mongoose.model("SalesAgent", SalesAgentSchema);

module.exports = { salesAgent };