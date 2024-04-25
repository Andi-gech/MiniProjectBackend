const mongoose=require('mongoose')
const joi=require('joi')
const CourseModuleSchema=mongoose.Schema(
    {
        name:String,
        content:String,
        completionExams:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Exams"
        }
    }
)
const CourseModule=mongoose.model("CourseModule",CourseModuleSchema)
const CourseModuleJoi=joi.object({
    name:joi.string().required(),
    content:joi.string().required(),
 
})
const validateCourseModule=(data)=>{
    return CourseModuleJoi.validate(data)
}
module.exports.CourseModule=CourseModule
module.exports.validateCourseModule=validateCourseModule
