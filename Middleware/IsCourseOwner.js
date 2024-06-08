const { Course } = require('../model/Courses');
const mongoose = require("mongoose");

const CourseOwner = async (req, res, next) => {
    try {
      const courseid=req.params.courseid
        const isValid = mongoose.Types.ObjectId.isValid(courseid);
        if (!isValid) {
            return res.status(400).send("Invalid id");
        }
        const result = await Course.find({
            createdBy: req.user._id,
            _id: courseid

        })
        if (!result) {
            return res.status(401).json({ error: 'only owner can perform this action' });
        }
        next();

       
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = CourseOwner;
