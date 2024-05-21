const express = require("express");
const router = express.Router();
const { CourseModule,validateCourseModule } = require("../model/CourseModule");
const checkModuleAvailability = require("../Middleware/ModuleAvailablity");
const AuthMiddleware = require("../Middleware/AuthMiddleware");
const { default: mongoose } = require("mongoose");
const isEnrolled = require("../Middleware/IsEnrolled");

router.get("/:id/:mid", AuthMiddleware,isEnrolled,checkModuleAvailability,async (req, res) => {
   try {
    const result=await CourseModule.findById(req.params.mid).populate('completionExams')
    res.send(result)
   } catch (error) {
    res.status(500).send(error.message);
   }
})

router.post("/", async (req, res) => {
    try {

    const { error } = validateCourseModule(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const result = await CourseModule.create(req.body)
    res.send(result)
}
    catch (error) {
        res.status(500).send(error.message);
    }

   
})
router.put("/:id", async (req, res) => {
    try {
    const { error } = validateCourseModule(req.body);
    const isvalid= mongoose.isValidObjectId(req.params.id)
    if (!isvalid) {
        return res.status(400).send("invalid id")
        }
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const result = await CourseModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(result)
    }
    catch (error) {
        res.status(500).send(error.message);
    }

    
})
router.delete("/:id", async (req, res) => {
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
module.exports = router;

