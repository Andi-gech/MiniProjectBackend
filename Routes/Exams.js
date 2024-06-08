const express = require("express");
const router = express.Router();
const {Exam} = require("../model/Exam");
const mongoose = require("mongoose");
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const { Result } = require("../model/Result");

router.get("/module/:moduleId", AuthMiddleware, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(moduleId);

    if (!isValid) {
      return res.status(400).send("Invalid module id");
    }

    const exams = await Exam.find({ CourseModule: moduleId });
    const result=await Result.find({
      exam:exams[0]._id,
      user:req.user._id,
      ispassed:true
    })
    const passed=result.length>0?true:false

   
    
    return res.send({
      exams:exams,
      passed:passed
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/:examId", async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId)
      .populate({
        path: "questions",
        populate: { path: "answers", model: "Answer" },
      })
      .exec();

    if (!exam) {
      return res.status(404).send("Exam not found");
    }

    return res.send(exam);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
