const mongoose = require("mongoose");
const validEmail = require("../helper.js").validEmail;

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: validEmail,
            message: "Invalid email address"
        }
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    },
    session: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("admin", AdminSchema);