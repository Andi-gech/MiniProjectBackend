const express = require('express');
const app = express();
const connect = require('./Connect');
const cors = require('cors');
const User = require('./Routes/User');
const Courses = require('./Routes/Courses');
const Exams = require('./Routes/Exams');
const CourseModule = require('./Routes/CourseModule');
const EnrolledCourse = require('./Routes/EnrollmentController');
const CourseCategory = require('./Routes/CourseCatagory'); // Corrected typo in variable name
const Admin = require('./Routes/AdminController');
const Notification = require('./Routes/Notifications');

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use('/images', express.static('public'));

app.use('/api/user', User);
app.use('/api/courses', Courses);
app.use('/api/admin', Admin);
app.use('/api/exams', Exams);
app.use('/api/coursemodule', CourseModule);
app.use('/api/enroll', EnrolledCourse);
app.use('/api/Notfication', Notification);
app.use('/api/coursecatagory', CourseCategory); // Corrected typo in route path

app.listen(8080, async () => {
    try {
        await connect();
        console.log("listening on port 8080");
    } catch (err) {
        console.log(err);
    }
});
