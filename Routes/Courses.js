const express=require('express')
const router=express.Router()

router.get('/',async(req,res)=>{
    res.send('hello from Courses route')
})
module.exports=router