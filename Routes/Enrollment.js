const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const {EnrolledCourse,validateEnrolledCourse}= require("../model/EnrolledCourse");
const {CourseModule,validateCourseModule}=require('../model/CourseModule');

const isEnrolled = require("../Middleware/IsEnrolled");
const AuthMiddleware = require("../Middleware/AuthMiddleware");

router.get("/",AuthMiddleware,async (req, res) => {
    try {
    const result = await EnrolledCourse.find(
        {
            user: req.user._id}
    ).populate('course')
    res.send(result)
    } catch (error) {
    res.status(500).send(error.message);
    }
})
router.put("/:id/complete",AuthMiddleware,isEnrolled,async(req,res)=>{
try{
    const isvalid=mongoose.Types.ObjectId.isValid(req.params.id)
    if(!isvalid){
        return res.status(400).send("invalid id")
    }
    const isvalidmid=mongoose.Types.ObjectId.isValid(req.body.moduleid)
    if(!isvalidmid){
         return res.status(400).send("invalid id")
    }
    const isexist= await CourseModule.findById(req.body.moduleid)
    if(!isexist){
        return res.status(404).send("module not found")
    }
    const Enrolled=await EnrolledCourse.findOne({
        course: req.params.id,
        user: req.user._id
    })
    if (Enrolled.completedModules.includes(req.body.moduleid)) {
        return res.status(400).send('Module already completed');
    }

    const result = await EnrolledCourse.findOneAndUpdate(
        {
            course: req.params.id,
            user: req.user._id
        } , {
            $push: {
                completedModules: {
                    id: req.body.moduleid
                }
            }
        })
    res.send(result)
}catch(error){
    res.status(500).send(error.message)
}
})
router.get("/:id",isEnrolled, async (req, res) => {
    try {
    const isvalid=mongoose.Types.ObjectId.isValid(req.params.id)
    if(!isvalid){
        return res.status(400).send("invalid id")
    }
    const result = await EnrolledCourse.findById(req.params.id);
    res.send(result)
    } catch (error) {
    res.status(500).send(error.message);
    }
})
router.post("/", AuthMiddleware,async (req, res) => {
    try {
    const { error } = validateEnrolledCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const data={
        user:req.user._id,
        course:req.body.course
    }
    const findEnroll=await EnrolledCourse.findOne(data)
    if(findEnroll){
        return res.status(400).send("user already enrolled")
    }
    const result = await EnrolledCourse.create(data);
    res.send(result)
    } catch (error) {
    res.status(500).send(error.message);
    }
    
})
 
module.exports = router;