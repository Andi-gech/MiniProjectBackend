const express = require("express");
const router = express.Router();
const { Question,ValidateJoiSchema } = require("../model/Question");

router.post("/", async (req, res) => {
    try {
    const { error } = ValidateJoiSchema(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const result = await Question.create(req.body);
    res.send(result);
} catch (error) {
    res.status(500).send(error.message);
}
    
})
router.get("/", async (req, res) => {
    try {
    const result = await Question.find();
    res.send(result);
} catch (error) {
    res.status(500).send(error.message);
}
    
})

module.exports = router