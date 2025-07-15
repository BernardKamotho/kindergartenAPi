const express = require("express");
const router = express.Router();
const { auth, authorizeRoles} = require("../middlewares/auth")

// Import the techers controller
const teacherController = require("../controllers/teacherController");

// Below is route to fetch all teachers
router.get('/', auth, teacherController.getAllTeachers);

// Below is the route to add a new teacher
router.post("/", teacherController.addTeacher);

// Below we fetch the details of a given teacher based on ID
router.get("/:id",auth, teacherController.getTeacherById);

// add the route to update
router.put("/:id",auth, authorizeRoles('admin'), teacherController.updateTeacher);



module.exports = router;