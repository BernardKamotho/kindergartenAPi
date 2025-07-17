const express = require('express');
const router = express.Router();


const assignmentController = require('../controllers/assignmentController');

// imporrt the middleware
const {auth} = require('../middlewares/auth');


router.get("/", assignmentController.getAllAssignments);

// add an assignment
router.post("/",auth, assignmentController.addAssignment);

// get assignment by id
router.get("/:id", assignmentController.getAssignmentById);

// update an assignment based on a given ID
router.put("/:id", assignmentController.updateAssignment);

// below is the route to delete an assignment
router.delete("/:id", assignmentController.deleteAssigment);

module.exports = router;