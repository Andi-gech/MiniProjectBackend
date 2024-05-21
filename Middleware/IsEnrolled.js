const { EnrolledCourse } = require("../model/EnrolledCourse");
const mongoose = require("mongoose");

const isEnrolled = async (req, res, next) => {

    try {
        console.log("passed to rnroo")
        const isvalid=mongoose.Types.ObjectId.isValid(req.params.id)
        if(!isvalid){
            return res.status(400).send("invalid id")
        }
          console.log(req.user)
        
        const result = await EnrolledCourse.find(
            {
                user: req.user._id,
                course: req.params.id
            }
        );
        
        if (result.length == 0) {
            return res.status(400).json({ error: 'User is not enrolled in this course' });
        }
        console.log("passs 2")
        next();
    }
    catch (error) {
        res.status(500).send(error)
    }
}
module.exports = isEnrolled