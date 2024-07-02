const express=require('express')
const router=express.Router()

const {CourseCatagory:CourseCat,ValidateJoiSchema}=require('../model/CourseCatagory')
const {CourseModule,validateCourseModule}=require('../model/CourseModule')
const AuthMiddleware = require('../Middleware/AuthMiddleware')

const {Course,validateCourse}=require('../model/Courses')
const {Exam}=require('../model/Exam')

const isAdmin = require('../Middleware/isAdmin')
const multer = require("multer");
const CourseOwner = require('../Middleware/IsCourseOwner')
const { Question } = require('../model/Question')
const { Answer } = require('../model/Answer')
const { EnrolledCourse } = require('../model/EnrolledCourse')
const mongoose = require("mongoose");
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


//create Catagory
router.post('/createCatagory',AuthMiddleware,isAdmin ,upload.single("image"),async (req,res)=>{
    try {
        const {error}=ValidateJoiSchema(req.body)
        const image = req.file;
        if(!image){
            return res.status(400).send("image is required")
        }
        req.body.image=`uploads/catagory/${image.filename}`
        if(error){
            return res.status(400).send(error.details[0].message)
        }
        const result=await CourseCat.create(req.body)
        res.send(result)
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error)
    }
})
//
router.post('/createCourse',AuthMiddleware,isAdmin,upload.single("image"),async(req,res)=>{
    try {

      const image = req.file;
      if(!image){
          return res.status(400).send("image is required")
      }
      
      req.body.image=`uploads/catagory/${image.filename}`
      req.body.createdBy=req.user._id
      const {error}=validateCourse(req.body)

      

  
      if(error){
          return res.status(400).send(error.details[0].message)
      }
      
      const result=await Course.create(req.body)
      return res.send(result)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error.message);
     
    }
      
  })
////////get 
router.get('/courses', AuthMiddleware,isAdmin,async (req, res) => {
    try {
      const result = await Course.find({
        createdBy: req.user._id
      })
      res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  
    
  })
router.get('/courses/inactive',async (req, res) => {
    try {
      const result = await Course.find({
        status: false
      })
      return res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  
})
router.put('/courses/approve/:id',AuthMiddleware,async (req, res) => {
    try {
      const result = await Course.findByIdAndUpdate(req.params.id, {
        status: true
      })
      return res.send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
})
///////get single course

router.get('/courses/:courseid', AuthMiddleware,isAdmin,CourseOwner,async (req, res) => {
    try {
      const result = await Course.findById(req.params.courseid);
      if (!result) {
        return res.status(404).send("Course not found");
      }
      const courseModules = await CourseModule.find({ course: req.params.courseid }).sort({ order: 1 })
  
      const enrolledStudents=await EnrolledCourse.find({course:req.params.courseid}).populate('user')
       return res.send({ result, courseModules, enrolledStudents });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  
  })


//create Module
router.post("/:courseid/createModule",AuthMiddleware,isAdmin,CourseOwner,upload.single("video"), async (req, res) => {
    try {
      req.body.course=req.params.courseid
    

    const { error } = validateCourseModule(req.body);
    const video = req.file;
    if(video){
      req.body.videolink=`uploads/catagory/${video.filename}`
    }
    
    
   
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const alreadyexist=await CourseModule.findOne({order:req.body.order,course:req.params.courseid})
    console.log(alreadyexist)
    if(alreadyexist){
        return res.status(400).send("order already exist")
    }
    const result = await CourseModule.create(req.body)
    res.send(result)
}
    catch (error) {
        res.status(500).send(error.message);
      
    }

   
})
//delete Module
router.delete("/:courseid/deleteModule/:id",AuthMiddleware,isAdmin,CourseOwner, async (req, res) => {
    try{

    
    const isvalid= mongoose.isValidObjectId(req.params.id)
    if (!isvalid) {
        return res.status(400).send("invalid id")
    }
    const result = await CourseModule.findByIdAndDelete(req.params.id);
    res.send(result)
}
    catch (error) {
        res.status(500).send(error.message);
    }
})
//add exam
router.post("/", async (req, res) => {
    const examData = req.body; 
  console.log(examData.courseModule)
      try {
        const newExam = new Exam(examData);
          console.log(newExam)
          const isvalid=mongoose.Types.ObjectId.isValid(newExam.CourseModule)
          if(!isvalid){
            console.log("invalid id")
              return res.status(400).send("invalid id")
          }
          const coursemodule=await CourseModule.findById(newExam.CourseModule)
          if(!coursemodule){
              return res.status(404).send("course not found")
          }
          
  
          
          const questions = examData.questions.map(async (question) => {
              const answers = await Promise.all(question.answers.map(async (answer) => {
                  const newAnswer = new Answer(answer);
                  await newAnswer.save();
                  return newAnswer._id;
              }));
  
              const newQuestion = new Question({
                  question: question.question,
                  mark: question.mark,
                  answers: answers, 
              });
              await newQuestion.save();
              return newQuestion._id;
          });
  
          
          const createdQuestions = await Promise.all(questions);
          console.log(createdQuestions)
  
        
          newExam.questions = createdQuestions;
  
          // Save the exam
          await newExam.save();
  
          res.json(newExam); // Send the created exam object back in the response
      } catch (error) {
          console.error('Error creating exam:', error);
          res.status(500).json({ message: 'Error creating exam' });
      }
  })

module.exports=router

