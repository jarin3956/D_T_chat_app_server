const { Server } = require('socket.io');
const crypto = require('crypto');


function createGroupChatRoom(friendIds) {
    const concatenatedString = friendIds.join('-'); 
    const hash = crypto.createHash('sha1').update(concatenatedString).digest('hex');
    const chatRoomId = hash.substring(0, 20);
    return chatRoomId;
}

function initializeSocket(server) {
    const io = new Server(server, { cors: true });
    const connectedUsers = new Set();

    io.on('connection', (socket) => {
        console.log(`User socketid: ${socket.id}`);
        // connectedUsers.add(socket.id);
        socket.on('set-up', (userId) => {
            console.log(`User ${userId} connected to chat`);
            socket.join(userId);
            socket.emit('chat-connected');
        });

        socket.on('addFriendToChat', ({ friendId }) => {
            console.log(`User added: ${friendId}`)
        });
        socket.on('startGroupChat', ({ friendIds }) => {
            const chatRoomId = createGroupChatRoom(friendIds);
            console.log('Chat room id emit', chatRoomId);
            friendIds.forEach((friendId) => {
                io.to(friendId).emit('groupChatStarted', { chatRoomId });
            });
        });
        // socket.on('disconnect', () => {
        //     console.log(`User disconnected: ${socket.id}`);
        //     connectedUsers.delete(socket.id);
        // });
    })
}

module.exports = { initializeSocket }