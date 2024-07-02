const { Notification } = require("../model/Notification");
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../Middleware/AuthMiddleware");

router.get("/", AuthMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id });
        return res.send(notifications);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});
module.exports = router