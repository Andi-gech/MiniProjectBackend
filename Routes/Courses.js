const express=require('express')
const router=express.Router()
const {Course,validateCourse}=require('../model/Courses')
const { CourseModule } = require('../model/CourseModule')
const { EnrolledCourse } = require('../model/EnrolledCourse')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const isEnrolled = require("../Middleware/IsEnrolled");
router.get('/',async(req,res)=>{
  try {
  const query = req.query.q || '';
  const regex = new RegExp(query, 'i');
  const result = await Course.find({ $or: [{ name: regex }, { description: regex }] });
 
    res.send(result)
  } catch (error) {
    res.status(500).send(error.message);
  }
})
router.post('/',async(req,res)=>{
  try {
    const {error}=validateCourse(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    
    const result=await Course.create(req.body)
    res.send(result)
  } catch (error) {
    res.status(500).send(error.message);
  }
    
})
router.get('/:id',async(req,res)=>{
  try {
    const result=await Course.findById(req.params.id).populate({
      path: 'modules',
      populate: {
          path: 'lesson',
          model: 'CourseModule'
      }
  })
    res.send(result)
} catch (error) {
    res.status(500).send(error.message);
}
})
router.put('/:id', async (req, res) => {
 try{
    const modulesToAdd = req.body.modules; // Assuming modules is an array of objects
  
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        modules: { $each: modulesToAdd }
      }
    }, { new: true });
  
    res.send(updatedCourse);
  } catch (error) {
    res.status(500).send(error.message);
  }
  });
  router.get('/enrolled', async (req, res) => {
    try {
    const result = await EnrolledCourse.find();
    res.send(result)
    } catch (error) {
    res.status(500).send(error.message);
    }
  })
  router.get('/MyCourses/:id',AuthMiddleware,isEnrolled,async(req,res)=>{
    try {
    const isvalidIds=mongoose.Types.ObjectId.isValid(req.params.id)
    if(!isvalidIds){
        return res.status(400).send("invalid id")
    }
    const result = await EnrolledCourse.find({user:req.user.id,course:req.params.id});
    res.send(result)
    } catch (error) {
    res.status(500).send(error.message);
    }
  })
  
module.exports=router
