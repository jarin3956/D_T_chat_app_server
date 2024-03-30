const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    groupId: {
        type: String,
        required: true
    },
    messageData: [
        {
            userName: {
                type: String, 
                required: true
            },
            message: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date, 
                default: Date.now
            }
        }
    ]
        
});

const messageData = mongoose.model('messageData', messageSchema);

module.exports = messageData;