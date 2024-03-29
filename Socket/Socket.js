const { Server } = require('socket.io');
const crypto = require('crypto');


function createGroupChatRoom(friendIds) {
    const concatenatedString = friendIds.join('-'); 
    const hash = crypto.createHash('sha1').update(concatenatedString).digest('hex');
    const chatRoomId = hash.substring(0, 20);
    console.log('Chat room id is', chatRoomId);
    return chatRoomId;
}

function initializeSocket(server) {
    const io = new Server(server, { cors: true });
    const connectedUsers = new Set();

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        connectedUsers.add(socket.id);
        socket.on('addFriendToChat', ({ friendId }) => {
            console.log(`User added: ${friendId}`)
        });
        socket.on('startGroupChat', ({ friendIds }) => {
            const chatRoomId = createGroupChatRoom(friendIds);
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