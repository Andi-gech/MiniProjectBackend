const mongoose=require('mongoose')
const joi=require('joi')
const CourseSchema=mongoose.Schema(
    {
        name:String,
        description:String,
        image:String,
        catagory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseCatagory"
        },
        modules:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"CourseModule"
            }
        ],
       
       
    }
)
const CourseJoi=joi.object({
    name:joi.string().required(),
    description:joi.string().required(),
    image:joi.string().required(),
    catagory:joi.string().required(),
    modules:joi.array().required(),
})
const Course=mongoose.model("Course",CourseSchema)
const validateCourse=(data)=>{
    return CourseJoi.validate(data)
}
module.exports.Course=Course
module.exports.validateCourse=validateCourse
