const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Removes whitespace
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});

// Add indexes for better performance
roomSchema.index({ name: 1 });
roomSchema.index({ users: 1 });

// Add a method to populate users and messages
roomSchema.methods.populateRoom = function() {
    return this.populate('users', 'username email')
               .populate('messages');
};

module.exports = mongoose.model('Room', roomSchema);