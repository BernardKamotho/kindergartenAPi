// import the schemas
const { Assignment, Classroom, Teacher, User } = require("../models/SchoolDb");

//====================
// Get all the assignments (Admin)
// We shall also include the details of the classroom and also the teachers


exports.getAllAssignments = async(req, res) =>{
    try{
        // we shall use the find() function to process the request
        const assignments = await Assignment.find()
        .populate('classroom', 'name gradeLevel classYear')
        .populate('postedBy', 'name email')


        // give a response with the assignments details
        res.json(assignments)
    }
    catch(err){
        // Handle any error that would occur when fetching the assignments
        res.status(500).json({ message : "Error fetching assignments", error: err.message})
    }
};

// ===============================
// Below is a route to add a new assignment
// As we add an assignment, we shall validate two important fields i.e teacher and the classroom
exports.addAssignment = async(req, res) =>{
    try{
        // get the details of the person already logged in from the authetication middleware
        const userId = req.user.userId;

        // console.log("The logged in ID is: ", userId)

        // fetch the user and populate the teacher field if it exists
        const user = await User.findById(userId).populate('teacher')
        console.log("The content of the user: ", user)

        // Block those who are not enlisted as teachers from posting assignments
        if(!user || !user.teacher){
            return res.status(403).json({message : "Only Teachers can post Assignments"})
        };

        // extract classroomID from the incoming request
        const {classroom : classroomId} = req.body;

        // console.log("The classroom ID is: ", classroomId)
        // We check whether the classroom exists before proceeding
        const classroomExists = await Classroom.findById(classroomId);

        if(!classroomExists){
            return res.status(404).json({message : "Classroom not found"});
        }

        // prepare the assignment data with the postedBy set to the current teacher
        // console.log("The id of the logged in teacher is: ", user.teacher.id)
        const assignmentData = {
            ...req.body,
            postedBy : user.teacher.id
        }

        // console.log("The content of assignmentData are: ", assignmentData)

        // save the assignment to the database
        const newAssingment = new Assignment(assignmentData);
        const savedAssignment = await newAssingment.save();

        // if the process is a success return a response
        res.status(201).json(savedAssignment)
    }
    catch(err){
        // handle any error if any occurs
        res.status(500).json({message : "Failed to add an assignment", error : err.message})
    }
};


// ===========================
// Get an assignment based on the ID
// We shall include the teacher and the classroom information
exports.getAssignmentById = async (req, res) =>{
    try{
        const assignment = await Assignment.findById(req.params.id)
        .populate('classroom', 'name gradeLevel classYear')
        .populate('postedBy', 'name email');

        // Check whether the assignment exists or not
        if(!assignment) {
            return res.status(404).json({message : "Assignment not found"})
        }

        // if the assignment is there return the details of the asssignment
        res.json(assignment)
    }
    catch(err){
        // handle any error during the process
        res.status(500).json({ message : "Error fetching the assignment", error : err.message})
    }
};

// ===============================
// Update a given assignment by use of the id
exports.updateAssignment = async (req, res) =>{
    try{
        // find the assignment by ID and update with the new data
        const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new : true});


        // check whethe there is an assignment with the given ID
        if(!updated){
            return res.status(404).json({message : "Assignment not found"})
        };

        res.json(updated);
    }
    catch(err){
        res.status(500).json({message : "Error updating the assignment", error : err.message})
    }

};

// ============================
// Delete an assignment 
// We shall use the assignment ID to do so

exports.deleteAssigment = async (req, res) =>{
    // we shall use the findByIdAndDelete() function
    try{

        const deleted = await Assignment.findByIdAndDelete(req.params.id);

        // check whether the asssignment with the given id is there or not
        if(!deleted){
            return res.status(404).json({message : "Assignment not Found...!"})
        }

        // if the given id is there and has been delete, return a response
        res.json({message : "Assignment Deleted Successfully"})

    }
    catch(err){
        res.status(500).json({message : "Error Deleting and Assignment", error: err.message})
    }
};