const AuthMiddleware = require("../Middleware/AuthMiddleware");
const mongoose = require("mongoose");
const { EnrolledCourse } = require("../model/EnrolledCourse");
const { CourseModule } = require("../model/CourseModule");
const {Notification}=require("../model/Notification")
const { validateEnrolledCourse } = require("../model/EnrolledCourse");
const { Result } = require("../model/Result");
const {Exam}=require("../model/Exam")
const {Course}=require("../model/Courses")
const {User}=require("../model/User")
const express = require("express")
const router = express.Router();
const Chapa = require('chapa')

let myChapa = new Chapa('CHASECK_TEST-gFVzUEvX8t2gMphMHXxf4v75KOnyHIPE')
router.post('/payinfo/verify',async (req,res)=>{
  
  console.log('signal incoming..........................')
  const jsonObj = JSON.parse(req.body.meta)
  const user=await User.findOne({email:req.body.email})
  console.log(
    'data get   ccccccccccccccccccc'
  )
  const course=await Course.findById(jsonObj.reference)
  const enroll =await EnrolledCourse.create({
    user:user._id,
    course:jsonObj.reference
  })
  
  console.log(enroll,"EEE")
  await Notification.create({user:user._id,description:`Enrolled to ${course.name}`})
  

  return res.send(enroll)

})


router.post("/pay/:id",AuthMiddleware, async (req, res) => {
  try{
const user=await User.findById(req.user._id)
const course=await Course.findById(req.params.id)
const enroll =await EnrolledCourse.findOne({user:user._id,course:course._id})
if(enroll){
  return res.status(400).send("Already enrolled")
}

const customerInfo =  {
  amount: course.price||0,
  currency: 'ETB',
  email: user.email,
  first_name: user.fullName,
  last_name: user.fullName,
  return_url: 'http://www.google.com',
  

 
  
 

  


  customization: {
    title: 'Test Title',
    description: 'Test Description',
  },

  
  meta: {
      reference: req.params.id
  }
  
}
  myChapa.initialize(customerInfo, { autoRef: true }).then(response => {
   console.log(response)
   
    return res.send(response)
    // saveReference(response.tx_ref)
}).catch(e => console.log(e)) 

  }catch(error){
    console.log(error)
  }
})

router.get('/:courseid', AuthMiddleware, async (req, res) => {
  try {
    const enrolledCourse = await EnrolledCourse.findOne({
      user: req.user._id,
      course: req.params.courseid
    })

    return res.send(enrolledCourse);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get('/completed/course',AuthMiddleware,async (req,res) => {
  try {
 
    const enrolledCourses = await EnrolledCourse.find({ user: req.user._id }).populate({
      path: "course",
      populate: [
        {
          path: "coursemodules",
               }
     
      ]
    });
    const completedCourses = enrolledCourses.filter((enrolledCourse) => {
      return enrolledCourse.completedModules.length===enrolledCourse.course.coursemodules.length
      
  
    })
    return res.send(completedCourses);
    
   
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message);
  }
   

   
})

router.get("/", AuthMiddleware, async (req, res) => {
  try {
    const enrolledCourses = await EnrolledCourse.find({ user: req.user._id }).populate({
      path: "course",
      populate: [
        {
          path: "coursemodules",
               },
        {
          path: "createdBy",
              }
      ]
    });
    

    return res.send(enrolledCourses);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.put("/:courseid/completemodule",AuthMiddleware, async (req, res) => {
  try {
    const isvalid = mongoose.Types.ObjectId.isValid(req.body.moduleid);
    console.log(req.body)
    if (!isvalid) {
      return res.status(400).send("invalid id");
    }

    const courseModule = await CourseModule.findById(req.body.moduleid);
    if (!courseModule) {
      return res.status(404).send("Module not found");
    }
    

    const enrolledCourse = await EnrolledCourse.findOneAndUpdate(
      {
        course: req.params.courseid,
        user: req.user._id,
      },
      {
        $push: {
          completedModules: {
            id: req.body.moduleid,
          },
        },
      },
      { new: true }
    );

    if (!enrolledCourse) {
      return res.status(404).send("User not enrolled to this course");
    }

    return res.send(enrolledCourse);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/enroll", AuthMiddleware, async (req, res) => {
  try {
    const { error } = validateEnrolledCourse(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const findEnroll = await EnrolledCourse.findOne({
      user: req.user._id,
      course: req.body.course,
    });

    if (findEnroll) {
      return res.status(400).send("User already enrolled");
    }

    const enrolledCourse = await EnrolledCourse.create({
      user: req.user._id,
      course: req.body.course,
    });

    return res.send(enrolledCourse);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
router.post("/exam/:examid/evaluate",AuthMiddleware, async (req, res) => {
    try {
    
      const {  examid } = req.params; // Exam ID
      const isvalid=mongoose.Types.ObjectId.isValid(examid)
      console.log(isvalid,'isvalid')
      if(!isvalid){
          return res.status(400).send("invalid id")
      }
    
  
      const { answers } = req.body; // Array of { "Answerid": "...", "Questionid": "..." }
  
      // Find the exam by ID and populate questions with answers
      const exam = await Exam.findById(examid).populate({
        path: "questions",
        populate: {
          path: "answers",
          model: "Answer", // Assuming your answer model is named "Answer"
        },
      });
  
      // Check if the exam exists
      if (!exam) {
        return res.status(404).send("Exam not found");
      }
  
      // Calculate total marks
      let totalMarks = 0;
      for (const answerData of answers) {
      
        const { Answerid, Questionid } = answerData;
      
  
        // Find the question by ID
        const question = exam.questions.find((q) => q._id.toString() === Questionid);
        if (!question) {
          return res.status(400).send(`Question with ID ${Questionid} not found in the exam`);
        }
        console.log(question)
  
        // Find the selected answer in the question
        const selectedAnswer = question.answers.find((a) => a._id.toString() === Answerid);
        if (!selectedAnswer) {
          return res.status(400).send(`Answer with ID ${Answerid} not found in question ${Questionid}`);
        }
  
        // If the answer is correct, add the mark to totalMarks
        if (selectedAnswer.isCorrect) {
          totalMarks +=1;
        }
      }
      const isPassed=totalMarks/exam.questions.length>0.5
     
  
      const result=await Result.create({
          user:req.user._id,
          exam:examid,
          history:req.body.answers,
          marks:totalMarks,
          ispassed:isPassed,
        
      })
  
      return res.send({result});
    
    } catch (error) {
      res.status(500).send(error.message);
      console.log(error)
    }
  });


module.exports = router