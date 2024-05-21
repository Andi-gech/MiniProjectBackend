const express=require('express')
const app=express()
const connect=require('./Connect')
var cors = require('cors')
const User=require('./Routes/User')
const Courses=require('./Routes/Courses')
const Questions=require('./Routes/Questions')
const Exams=require('./Routes/Exams')
const Answer=require('./Routes/Answer')
const Documentation=require('./Routes/Documentation')
const CourseModule=require('./Routes/CourseModule')
const EnrolledCourse=require('./Routes/Enrollment')

app.use(cors())
app.use(express.json())

app.use('/api/user',User)
app.use('/api/courses',Courses)
app.use('/api/questions',Questions)

app.use('/api/exams',Exams)
app.use('/api/answer',Answer)
app.use('/api/coursemodule',CourseModule)
app.use('/api/enrolledcourse',EnrolledCourse)
app.use('/',Documentation)

app.listen(8080,async()=>{
    try{
        await connect()
        console.log("listening on port 8080")
    }
    catch(err){
        console.log(err)
    }
})
