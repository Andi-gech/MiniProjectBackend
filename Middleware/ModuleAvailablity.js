const { mongoose } = require('mongoose');
const { CourseModule } = require('../model/CourseModule');
const { EnrolledCourse } = require('../model/EnrolledCourse');

const isModuleAvailable = async (req, res, next) => {
  const { moduleid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(moduleid)) {
    return res.status(400).send('Invalid module id');
  }
console.log(moduleid)
  const module = await CourseModule.findById(moduleid);
  if (!module) {
    return res.status(404).send('Module not found');
  }

  if (module.order === 0) {
    return next();
  }

  const previousModuleOrder = Number(module.order) - 1;
  const previousModule = await CourseModule.findOne({
    course: module.course,
    order: previousModuleOrder.toString()
  });

  if (!previousModule) {
    return next();
  }

  const enrolledCourse = await EnrolledCourse.findOne({
    course: module.course,
    user: req.user._id
  });

  if (!enrolledCourse) {
    return res.status(401).send('User is not enrolled in this course');
  }

  const isModuleCompleted = enrolledCourse.completedModules.some(
    ({ id }) => id.equals(previousModule._id)
  );

  if (isModuleCompleted) {
    return next();
  }

  return res.status(400).send('Previous module not completed');
};

module.exports = isModuleAvailable;
