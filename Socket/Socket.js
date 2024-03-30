const { Server } = require('socket.io');
const crypto = require('crypto');
const MessageData = require('../Model/messageModel');


function createGroupChatRoom(friendIds) {
    const concatenatedString = friendIds.join('-'); 
    const hash = crypto.createHash('sha1').update(concatenatedString).digest('hex');
    const chatRoomId = hash.substring(0, 20);
    return chatRoomId;
}

function initializeSocket(server) {
    const io = new Server(server, { cors: true });
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log(`User socketid: ${socket.id}`);
        socket.on('set-up', (userId) => {
            console.log(`User ${userId} connected to chat`);
            connectedUsers.set(userId, socket.id);
            socket.join(userId);
        });

        socket.on('addFriendToChat', ({ friendId }) => {
            console.log(`User added: ${friendId}`)
        });
        socket.on('startGroupChat', ({ friendIds, iUser,iUserId }) => {
            const chatRoomId = createGroupChatRoom(friendIds);
            socket.join(chatRoomId);
            friendIds.forEach((friendId) => {
                if (friendId !== iUserId) {
                    const friendSocketId = connectedUsers.get(friendId);
                    if (friendSocketId) {
                        io.to(friendSocketId).emit('groupChatStarted', { chatRoomId, iUser });
                    }
                }
            });

            const initiatorSocketId = connectedUsers.get(iUserId);
            if (initiatorSocketId) {
                io.to(initiatorSocketId).emit('groupChatStarted', { chatRoomId });
            }
        });
        socket.on('usr-joined-chat',({ theId,theName,chatRoomId }) => {
            io.to(chatRoomId).emit('user-entered', theName);
        });
        socket.on('usr-rej-chat',({ theId,theName,chatRoomId }) => {
            io.to(chatRoomId).emit('user-rejected', theName);
        });
        
        socket.on('send-msg', async ({ msg, roomId, userName }) => {
            try {
                const message = {
                    userName: userName,
                    message: msg,
                    createdAt: new Date()
                };
                const savedMessage = await MessageData.findOneAndUpdate(
                    { groupId: roomId }, 
                    { $push: { messageData: message } }, 
                    { upsert: true, new: true } 
                );
                io.to(roomId).emit('new-msg', savedMessage.messageData);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
        
        socket.on('join-chat', async (roomId) => {
            try {
                const messages = await MessageData.findOne({ groupId: roomId });
                if (messages) {
                    socket.emit('chat-history', messages.messageData);
                }
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        });

        socket.on('disconnect-chat', () => {
            console.log(`User disconnected: ${socket.id}`);
            connectedUsers.delete(socket.id);
        });
    })
}

module.exports = { initializeSocket }

