const express=require('express')
const router=express.Router()

const {CourseCatagory}=require('../model/CourseCatagory')




//get All CourseCatagory
router.get('/',async (req,res)=>{
    try {
const result=await CourseCatagory.find()
res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

//get Single CourseCatagory
router.get('/:id',async (req,res)=>{
    try {
        const result=await CourseCatagory.findById(req.params.id)
        res.send(result)
        
    } catch (error) {
        return res.status(500).send(error.message)
    }
})


module.exports=router