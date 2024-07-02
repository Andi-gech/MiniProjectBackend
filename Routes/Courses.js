const express=require('express')
const router=express.Router()
const {Course}=require('../model/Courses');
const { CourseModule } = require('../model/CourseModule');

router.get('/', async (req, res) => {
  try {
    console.log(req.query.q)
    const query = req.query.q || '';
    const categoryId = req.query.category || '';

    let searchCriteria = {
      status: true 
    };

    if (query) {
      const regex = new RegExp(query, 'i');
      searchCriteria.$or = [{ name: regex }, { description: regex }];
    }

    if (categoryId) {
      searchCriteria.catagory = categoryId;
    }

    const result = await Course.find(searchCriteria);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});





router.get('/:courseid', async (req, res) => {
  try {
    const result = await Course.findById(req.params.courseid)
      .populate('catagory')
      .populate('createdBy')
      .populate({
        path: 'coursemodules',
        select: 'name order', // Select only 'name' and 'order' fields
        options: { sort: { order: 1 } } // Sort by 'order' field in ascending order
      });

    return res.send(result);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

 
  
  
module.exports=router
