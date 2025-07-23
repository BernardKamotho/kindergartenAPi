// import the express module
const express = require("express");
const router = express.Router();
const studentController = require('../controllers/studentsController');

const {auth, authorizeRoles} = require("../middlewares/auth");


// Below is the route to Get all students
router.get("/",auth,  studentController.getAllStudents);

// below is the route to add a new student
router.post("/",auth,authorizeRoles("admin"), studentController.uploadStudentPhoto, studentController.addStudent);

// get a student based on the ID
router.get("/:id",auth, studentController.getStudentById);

// below is route to update the details of the student
router.put("/:id",auth,authorizeRoles("admin"), studentController.updateStudentDetails);

// below is the delete route
router.delete("/:id", auth,authorizeRoles("admin"), studentController.DeleteAStudent)


// export the module
module.exports = router;