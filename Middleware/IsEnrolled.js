const EnrolledCourse = require("../model/EnrolledCourse");

const isEnrolled = async (req, res, next) => {
    try {
        const courseId = req.params.courseid;
        const userId = req.user._id;

        const isValid = mongoose.Types.ObjectId.isValid(courseId);
        if (!isValid) {
            return res.status(400).send("Invalid id");
        }

        const result = await EnrolledCourse.findOne({ user: userId, course: courseId });
        if (!result) {
            return res.status(401).json({ error: 'User is not enrolled in this course' });
        }

        next();
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = isEnrolled;
