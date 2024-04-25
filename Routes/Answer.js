const express= require('express')
const router=express.Router()
router.get('/',(req,res)=>{
    res.send('hello from Answer route')
})
module.exports=router