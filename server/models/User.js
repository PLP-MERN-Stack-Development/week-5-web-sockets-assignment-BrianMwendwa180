const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        required: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    timestramp: {
        type: Date,
        default: Date.now,
    },

    
})

module.exports = mongoose.model('User', userSchema);