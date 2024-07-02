const mongoose = require("mongoose");
const joi=require('joi')
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role:{
        type:String,
        enum:['admin','student','teacher'],
        default:'student'
    },
profilepic:String,
status:{
    type:Boolean,
    default:false
},
rating:[
    {
        rate:{
            type:Number,
            min:0,
            max:5
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
]

}, {
    toJSON: { virtuals: true }, // Enable virtuals in JSON output
    toObject: { virtuals: true } // Enable virtuals in object output
})
userSchema.virtual('averageRating').get(function () {
    if (this.rating.length === 0) {
        return 0;
    }
    const total = this.rating.reduce((acc, rating) => acc + rating.rate, 0);
    return total / this.rating.length;
});

const User = mongoose.model("User", userSchema);
const Joiuser=joi.object({
    fullName:joi.string().min(6).required(),
    email:joi.string().email().required(),
    password:joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
      'string.empty': `Password cannot be empty.`,
      'any.required': `Password is required.`
    }),
    role:joi.valid('admin','student','teacher').required(),
    confirmpassword:joi.string().required().valid(joi.ref('password')).messages(
        {
            'any.only': 'Passwords do not match'
            
        }
    ),
    profilepic:joi.string(),
    status:joi.boolean()

})
const joiauth=joi.object({
    email:joi.string().min(6).email().required(),
    password:joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
      'string.empty': `Password cannot be empty.`,
      'any.required': `Password is required.`
    })
    

    
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