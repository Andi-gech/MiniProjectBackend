const mongoose = require("mongoose");
const joi=require('joi')
const EnrolledCourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    completedModules: [
        {

        result: Number,
        
        
       id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseModule",
        }
    }
    ]
    ,

    
})
const EnrolledCourse = mongoose.model("EnrolledCourse", EnrolledCourseSchema);
const JoiEnrolledCourse=joi.object({
 
    course:joi.string().required(),
 
})
const validateEnrolledCourse=(data)=>{
    return JoiEnrolledCourse.validate(data)
}

module.exports.EnrolledCourse=EnrolledCourse
module.exports.validateEnrolledCourse=validateEnrolledCourse