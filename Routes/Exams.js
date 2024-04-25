const express = require("express");
const { Exam } = require("../model/Exam");

const router = express.Router();
router.get("/", async(req, res) => {
const result = await Exam.find(
    
    
)

res.send(result)
})
module.exports = router