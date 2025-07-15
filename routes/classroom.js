// Classroom routes
const express = require('express');
const router = express.Router();
const classroomController = require("../controllers/classroomController");


// import the auth from middleware so as to ensure the person who is adding a newclassrom is authenticated
const { auth, authorizeRoles } = require("../middlewares/auth");


// adding a new class router
router.post('/',auth, authorizeRoles('admin'), classroomController.addClassroom);

// below is the route to get all classrooms
router.get('/',auth, classroomController.getAllClassrooms);

// Below is the route for fetching a single classroom
router.get('/:id',auth, classroomController.getClassroomById);

// Below is the update route
router.put("/:id", classroomController.updateClassroom);

// Below is the endopoint to delete a classroom
router.delete("/:id",auth, authorizeRoles('admin'), classroomController.deleteClassroom);


module.exports = router;