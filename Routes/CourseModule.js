const express = require("express");
const router = express.Router();
const { CourseModule } = require("../model/CourseModule");
const isModuleAvailable = require("../Middleware/ModuleAvailablity");
const AuthMiddleware = require("../Middleware/AuthMiddleware");

//get  single module

router.get("/:moduleid", AuthMiddleware,isModuleAvailable,async (req, res) => {
   try {
    console.log(req.params.moduleid)
    const result=await CourseModule.findById(req.params.moduleid)
    return res.send(result)
   } catch (error) {
  
   return  res.status(500).send(error.message);
    }
})
// get all module with same course
router.get("/course/:courseid", AuthMiddleware, async (req, res) => {
  try {
    const result = await CourseModule.find({ course: req.params.courseid }).sort({ order: 1 });
  
    return res.send(result);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});


module.exports = router;

