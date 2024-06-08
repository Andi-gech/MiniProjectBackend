const { User } = require('../model/User');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ error: 'User is not an admin' });
        }
        next();
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = isAdmin;
