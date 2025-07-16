const express = require("express");
const router = express.Router();
const { auth, authorizeRoles} = require("../middlewares/auth")

// Import the techers controller
const teacherController = require("../controllers/teacherController");

// Below is route to fetch all teachers
router.get('/', auth, teacherController.getAllTeachers);

// Below is the route to add a new teacher
router.post("/",auth,authorizeRoles('admin'), teacherController.addTeacher);

// Below we fetch the details of a given teacher based on ID
router.get("/:id",auth, teacherController.getTeacherById);

// add the route to update
router.put("/:id",auth, authorizeRoles('admin'), teacherController.updateTeacher);

// Below is the endpoint to delete a teacher
router.delete("/:id", teacherController.deleteTeacher);

// Below is the route to show the classes been taught by a given teacher
router.get("/myClasses", auth, teacherController.getMyClasses);


// Below is the route to access specific posted assignments by the teacher
router.get("/myassignments", teacherController.getMyAssignments);


module.exports = router;