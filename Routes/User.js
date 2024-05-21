const express=require('express')
const router=express.Router()
const {User,ValidateJoiSchema,ValidateJoiAuth}=require('../model/User')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')
const secretpassword="mysecretpassword"

router.post('/Auth',async (req,res)=>{
    try {
        
    const {error}=ValidateJoiAuth(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    console.log(req.body.email)
   
    const user=await User.findOne({email:req.body.email})
console.log(user)
 if(!user){
        return res.status(400).send('invalid email or password')
    }
    const validPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validPassword){
        return res.status(400).send('invalid email or password')
    }
    const token=jwt.sign({_id:user._id,role:user.role,fullName:user.fullName,email:user.email},secretpassword,{expiresIn:'7d'})
    res.send({
        token:token,
        role:user.role,
        name:user.fullName
    })
    } catch (error) {
        res.status(500).send(error)
        
    }
    


  
})

router.post('/create',async (req,res)=>{
    try {
    const {error}=ValidateJoiSchema(req.body)
    if(error){
        return res.send(error.details[0].message)
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    req.body.password=hashedPassword
    const user=await User.create(req.body)
    res.send(user)
}
    catch (error) {
        res.status(500).send(error)
        
    }
 
})
module.exports=router