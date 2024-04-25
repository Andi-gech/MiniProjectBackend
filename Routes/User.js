const express=require('express')
const router=express.Router()
const {User,ValidateJoiSchema}=require('../model/User')
const bcrypt=require('bcrypt')

router.get('/',(req,res)=>{
    res.send('hello from User route')
})

router.post('/create',async (req,res)=>{
    const {error}=ValidateJoiSchema(req.body)
    if(error){
        return res.send(error.details[0].message)
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    req.body.password=hashedPassword
    const user=await User.create(req.body)
    res.send(user)
 
})
module.exports=router