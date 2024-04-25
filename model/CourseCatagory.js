const mongoose = require("mongoose");
const joi=require('joi')
const CourseCatagorySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
})
const CourseCat=mongoose.model("CourseCatagory", CourseCatagorySchema)
const CourseCatagoryJoi = joi.object({
    name: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().required(),
    courses: joi.array().required(),
})
const ValidateJoiSchema = (data) => {
    return CourseCatagoryJoi.validate(data);
};
module.exports.CourseCat=CourseCat
module.exports.ValidateJoiSchema = ValidateJoiSchema