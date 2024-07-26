const express=require('express')
const router=express.Router()
const {User,ValidateJoiSchema,ValidateJoiAuth}=require('../model/User')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const { Notification } = require('../model/Notification')
const secretpassword="mysecretpassword"
const multer = require("multer");
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/catagory'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate a unique filename
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append the original file extension
  },
});

const upload = multer({ storage: storage });



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
        name:user.fullName,
        id:user._id
    })
    } catch (error) {
        res.status(500).send(error)
        
    }
    


   
})

router.post('/create',async (req,res)=>{
    try {
    const {error}=ValidateJoiSchema(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    req.body.password=hashedPassword
    const user=await User.create(req.body)
    Notification.create({user:user._id,description:`Welcome ${user.fullName}`})
    res.send(user)
}
    catch (error) {
        res.status(500).send(error)
        
    }
 
})
router.get('/all',async (req,res)=>{
    try {
        const result=await User.find({role:{$ne:'admin'}},{password:0})
        return res.send(result)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
})
router.get('/Teacher',async (req,res)=>{
    try {
        const result=await User.find({role:'teacher'}).sort({ averageRating: -1})
        
        return res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
})
router.get('/:id',async (req,res)=>{
    try {
        const result=await User.findById(req.params.id)
        return res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
})
router.put('/:id',async (req,res)=>{
    try {
        const result=await User.findByIdAndUpdate(req.params.id,req.body)
        return res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
})
router.put('/update/me',AuthMiddleware,upload.single("profilepic"),async (req,res)=>{
    try {
        console.log(req.body)
        console.log(req.file)
        const image = req.file;
        
        if(image){
        
            req.body.profilepic=`uploads/catagory/${image.filename}`
        }
        
        const result=await User.findByIdAndUpdate(req.user._id,req.body)
        return res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
    
})
router.delete('/:id',async (req,res)=>{
    try {
        const result=await User.findByIdAndDelete(req.params.id)
        return res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

router.put('/rate/:id',AuthMiddleware,async (req,res)=>{
    try {
        console.log(req.body.rate)
        console.log(req.user._id)
        const result=await User.findByIdAndUpdate(req.params.id,{
            $push: {
              rating:{
                rate:req.body.rate,
                user:req.user._id
              } 
            },
           
        },{new:true})
        return res.send(result)
     
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

module.exports=router