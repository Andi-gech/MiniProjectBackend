const { default: mongoose } = require('mongoose');
const { Course } = require('../model/Courses');
const { EnrolledCourse } = require('../model/EnrolledCourse');



const checkModuleAvailability = async (req, res, next) => {
    try {
       const courseId = req.params.id;
        const moduleId = req.params.mid;
        const isvalidCoursid=mongoose.Types.ObjectId.isValid(courseId)
        const isvalidModuleid=mongoose.Types.ObjectId.isValid(moduleId)
        if(!isvalidCoursid || !isvalidModuleid){
            return res.status(400).json({ error: 'Invalid course or module ID' });
        }


       const course = await Course.findById(courseId);
        
       if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const moduleExists = course.modules.some(module => module.lesson.toString() === moduleId);

        if (!moduleExists) {
            return res.status(404).json({ error: 'Module not found in the course' });
        }

     const module = course.modules.find(mod => mod.lesson.toString() === moduleId);
        const prevOrder = module.order - 1;

      let prevModule;
        if (prevOrder >= 0) {
            prevModule = course.modules.find(mod => mod.order === prevOrder);
            if (!prevModule) {
                console.log('pass3')
                return next();     }
        }

        const enrolledCourse = await EnrolledCourse.findOne({ course: course?._id });
        if (!enrolledCourse) {
            return res.status(404).json({ error: 'Enrolled course not found' });
        }
console.log(enrolledCourse.completedModules)

const isPrevModuleCompleted = enrolledCourse.completedModules.some(
    module => module.id.toString() === prevModule.lesson.toString()
  );
  
  if (isPrevModuleCompleted) {
    next(); 
    
  } else {
    return res.status(401).json({ error: 'Please unlock the previous module' });
  }
  
      
    } catch (error) {
        console.error('Error in checkModuleAvailability middleware:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = checkModuleAvailability;