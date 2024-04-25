const mongoose=require('mongoose')
const joi=require('joi')
const ExamSchema=mongoose.Schema(
    {
        title:String,
        questions:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Question"
            }
        ],
        totalMarks:Number,
        passingMarks:Number,
        examDuration:Number
    }
)
const Exam=mongoose.model("Exam",ExamSchema)
const JoiExam=joi.object({
    title:joi.string().required(),
    questions:joi.array().required(),
    totalMarks:joi.number().required(),
    passingMarks:joi.number().required(),
    examDuration:joi.number().required()
})
const ValidateJoiSchema=(data)=>{
    return JoiExam.validate(data)
}
module.exports.Exam=Exam
module.exports.ValidateJoiSchema=ValidateJoiSchema