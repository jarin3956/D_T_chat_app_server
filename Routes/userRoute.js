const express = require('express');
const user_route = express();
const user_controller = require('../Controller/userController');
const {userAuth} = require('../Middleware/userMiddleware')

user_route.post('/register',user_controller.userRegister);
user_route.post('/login',user_controller.userLogin);
user_route.get('/newfriends',userAuth,user_controller.findFriends);
user_route.post('/add-friend',userAuth,user_controller.addFriend);
user_route.get('/profile',userAuth ,user_controller.userProfile);
user_route.get('/friends',userAuth,user_controller.friends);
user_route.post('/avatar',userAuth,user_controller.avathar);


module.exports = user_route;