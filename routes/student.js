// import the express module
const express = require("express");
const router = express.Router();
const studentController = require('../controllers/studentsController');


// Below is the route to Get all students
router.get("/", studentController.getAllStudents);

// below is the route to add a new student
router.post("/",studentController.uploadStudentPhoto, studentController.addStudent);

// get a student based on the ID
router.get("/:id", studentController.getStudentById);

// below is route to update the details of the student
router.put("/:id", studentController.updateStudentDetails);




// export the module
module.exports = router;