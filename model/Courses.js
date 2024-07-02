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
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        status:{
            type:Boolean,
            default:false
        }
        
        
       
    }, { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
CourseSchema.virtual('coursemodules', {
    ref: 'CourseModule',
    localField: '_id',
    foreignField: 'course'
});


const CourseJoi=joi.object({
    name:joi.string().required(),
    description:joi.string().required(),
    image:joi.string().required(),
    catagory:joi.string().required(),
    createdBy:joi.string().required(),
    
    
    
})
const Course=mongoose.model("Course",CourseSchema)
const validateCourse=(data)=>{
    return CourseJoi.validate(data)
}
module.exports.Course=Course
module.exports.validateCourse=validateCourse
