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
                order:{
                    type:Number,
                    default:0,
                    unique:true,
            
                    min:0
                },
            lesson:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"CourseModule",
                unique:true
            }
        }
        ],
       
       
    }
)
const CourseJoi=joi.object({
    name:joi.string().required(),
    description:joi.string(),
    image:joi.string(),
    catagory:joi.string(),
    modules:joi.array(),
})
const Course=mongoose.model("Course",CourseSchema)
const validateCourse=(data)=>{
    return CourseJoi.validate(data)
}
module.exports.Course=Course
module.exports.validateCourse=validateCourse
