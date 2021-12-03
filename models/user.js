const mongoose = require("mongoose");
const validEmail = require("../helper.js").validEmail;

let UserSchema = new mongoose.Schema({
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
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = mongoose.model("user", UserSchema);