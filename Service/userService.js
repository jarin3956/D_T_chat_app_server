const userData = require('../Model/userModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const securePass = async (password) => {
    const hash = await argon2.hash(password);
    return hash;
}


const registerUser = async (name, email, password, age) => {
    try {
        const userFound = await userData.findOne({ email: email });
        if (userFound) {
            return { status: 409, message: 'Email already used' };
        } else {
            const spassword = await securePass(password);
            const user = new userData({
                name,
                email,
                age,
                password: spassword
            });

            if (user) {
                let userSave = await user.save();
                if (userSave) {
                    return { status: 200, message: 'User Created', user };
                } else {
                    return { status: 400, message: 'Failed to save user' };
                }
            } else {
                return { status: 400, message: 'Failed to save user' };
            }
        }
    } catch (error) {
        throw error;
    }
}

const verifyHash = async (password, hash) => {
    const valid = await argon2.verify(hash, password);
    return valid
}

const loginUser = async (email, password) => {
    try {
        const user = await userData.findOne({ email: email })
        if (user) {
            const passCheck = await verifyHash(password, user.password);
            if (passCheck) {
                const role = 'user';
                const token = jwt.sign({ userId: user._id, role: role }, process.env.USER_SECRET);
                if (token) {
                    return { status: 200, message: 'Login Passed', user: token };
                } else {
                    return { status: 400, message: 'Cannot create token' };
                }
            } else {
                return { status: 401, message: 'Password do not match' };
            }
        } else {
            return { status: 404, message: 'Failed to find user' };
        }
    } catch (error) {
        throw error;
    }
}

const findNewFriends = async (ud) => {
    try {
        const user = await userData.findById(ud.userId);
        if (!user) {
            return { status: 404, message: 'User not found' };
        }
        const userFriendIds = user.friends.map(friend => friend.id);
        const users = await userData.find({ _id: { $nin: [...userFriendIds, ud.userId] } });
        if (users) {
            return { status: 200, message: 'Users data passed', users };
        } else {
            return { status: 400, message: 'Cannot find users' };
        }

    } catch (error) {
        throw error;
    }
}

const addNewFriend = async (ud, fId, faNme) => {
    try {
        const user = await userData.findById(ud.userId);
        user.friends.push({ id: fId, name: faNme });
        let friendSaved = await user.save();
        if (friendSaved) {
            return { status: 200, message: 'Added friend successfully' };
        } else {
            return { status: 400, message: 'Cannot add friend' };
        }
    } catch (error) {
        throw error;
    }
}

const findProfile = async (ud) => {
    try {
        const user = await userData.findById(ud.userId);
        if (user) {
            return { status: 200, message: 'Users data found', user };
        } else {
            return { status: 400, message: 'Cannot find user data' };
        }
    } catch (error) {
        throw error;
    }
}

const findFriends = async (ud) => {
    try {
        const user = await userData.findById(ud.userId);
        if (!user) {
            return { status: 404, message: 'User not found' };
        }
        const userFriendIds = user.friends.map(friend => friend.id);
        const users = await userData.find({ _id: { $in: userFriendIds } });
        if (users) {
            return { status: 200, message: 'Friends data passed', users };
        } else {
            return { status: 400, message: 'Cannot find friends' };
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    registerUser,
    loginUser,
    findNewFriends,
    addNewFriend,
    findProfile,
    findFriends
};
