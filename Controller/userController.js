const userService = require('../Service/userService');

const userRegister = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;
        const result = await userService.registerUser(name, email, password, age);
        res.status(result.status).json({ message: result.message, user: result.user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const userLogin = async (req,res) => {
    try {
        const {email,password} = req.body;
        const result = await userService.loginUser(email,password);
        res.status(result.status).json({ message: result.message, user: result.user });
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const findFriends = async (req,res) => {
    try {
        let userId = req.decoded;
        const result = await userService.findNewFriends(userId);
        res.status(result.status).json({ message: result.message, users: result.users });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const addFriend = async (req,res) => {
    try {
        let userId = req.decoded;
        let {friendId,friendName} = req.body;
        const result = await userService.addNewFriend(userId, friendId, friendName);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const userProfile = async (req,res) => {
    try {
        let userId = req.decoded;
        const result = await userService.findProfile(userId);
        res.status(result.status).json({ message: result.message, user: result.user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

const friends = async (req,res) => {
    try {
        let userId = req.decoded;
        const result = await userService.findFriends(userId);
        res.status(result.status).json({ message: result.message, users: result.users });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports = {
    userRegister,
    userLogin,
    findFriends,
    addFriend,
    userProfile,
    friends
};
