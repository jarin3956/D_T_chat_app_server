const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1] || null;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.USER_SECRET);
        const { role } = decoded;
        if (role !== 'user') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.decoded = decoded;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    userAuth
};