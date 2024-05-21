const express = require("express");
const { Exam,ValidateJoiSchema } = require("../model/Exam");
const {EnrolledCourse} = require('../model/EnrolledCourse')
const mongoose = require("mongoose");
const AuthMiddleware = require("../Middleware/AuthMiddleware");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
  const { error } = ValidateJoiSchema(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const result = await Exam.create(req.body);
  res.send(result);
} catch (error) {
  res.status(500).send(error.message);
}
})

router.get("/:id", async (req, res) => {
  try {
    const result = await Exam.findById(req.params.id).populate({
      path: "questions",
      populate: {
        path: "answers",
        model: "Answer",
      },
    })
    res.send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post("/:id/:mid/:eid/evaluate",AuthMiddleware, async (req, res) => {
  try {
  
    const { eid,id,mid } = req.params; // Exam ID
    const isvalid=mongoose.Types.ObjectId.isValid(eid)
    if(!isvalid){
        return res.status(400).send("invalid id")
    }
    const isvalidmid=mongoose.Types.ObjectId.isValid(mid)
    if(!isvalidmid){
        return res.status(400).send("invalid id")
    }


    const { answers } = req.body; // Array of { "Answerid": "...", "Questionid": "..." }

    // Find the exam by ID and populate questions with answers
    const exam = await Exam.findById(eid).populate({
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
    const isPassed=totalMarks>exam.passingMarks
    const modulesToAdd=[
      {
          id:mid}
    ]
    if(isPassed){
  const res= await EnrolledCourse.findOneAndUpdate(
      {
          course: id,
          user: req.user._id
      } , {
        $addToSet: {
          completedModules: { $each: modulesToAdd }
        }
      })
          console.log(res)
        
    }

    // Send the total marks as response
    res.send({ totalMarks: totalMarks ,isPassed:isPassed});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;