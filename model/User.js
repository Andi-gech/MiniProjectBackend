const mongoose = require("mongoose");
const joi=require('joi')
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role:{
        default:"student",
        type:String
    },
profilepic:String

})

const User = mongoose.model("User", userSchema);
const Joiuser=joi.object({
    fullName:joi.string().required(),
    email:joi.string().required(),
    password:joi.string().required(),
    role:joi.string().required(),
    profilepic:joi.string()
})
const joiauth=joi.object({
    email:joi.string().required(),
    password:joi.string().required()
})
const ValidateJoiSchema=(data)=>{
    return Joiuser.validate(data)
}
const ValidateJoiAuth=(data)=>{
    return joiauth.validate(data)
}
module.exports.User = User;
module.exports.ValidateJoiAuth=ValidateJoiAuth
module.exports.ValidateJoiSchema=ValidateJoiSchema