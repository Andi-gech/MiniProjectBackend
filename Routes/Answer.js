const express= require('express')
const {Answer,ValidateJoiSchema}=require('../model/Answer')
const router=express.Router()
router.get('/',(req,res)=>{
    res.send('hello from Answer route')
})
router.post('/',async(req,res)=>{
    try {
    const {error}=ValidateJoiSchema(req.body)
    if(error){
        return res.status(400).send(error.details[0].message)
    }
    const result=await Answer.create(req.body)
    res.send(result)
} catch (error) {
    res.status(500).send(error.message);
}
})
module.exports=router