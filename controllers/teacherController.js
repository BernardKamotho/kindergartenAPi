const { Teacher, User, Classroom, Assignment } = require("../models/SchoolDb");
const bcrypt = require("bcrypt");


exports.getAllTeachers = async(req, res)=>{
    try{
        // we shall use the find() function to retrieve all teachers
        const teachers = await Teacher.find()

        // give a response with the details of all the teachers
        res.json(teachers)
    }
    catch(err){
        //handle any error incase there will be.
        res.status(500).json({message : "Error fetching Teachers", error : err.message})
    }
};


// ==================================
// Adding a new teacher
exports.addTeacher = async (req, res)=>{
    try{
        // Step 1: Create a Teacher document with data gotten from insomnia req with a body
        // get the email address from the sent request
        // console.log(req.body)
        const { email } = req.body;
        // console.log("The email is: ", email)

        const existEmail = await Teacher.findOne({ email })
        if (existEmail) {
            return res.status(404).json({message : "Teacher Already Exists"})
        }

        // if the email does not exist inside of the db, proceed to register the teacher
        const newTeacher = new Teacher(req.body);
        const savedTeacher = await newTeacher.save();

        // console.log("The Saved Teacher's details are: ", savedTeacher)

        // step 2: Create a corresponding User document for login purposes

        // Create a default password for the Teacher which he shall later on change when he logins in
        const defaultPassword = 'teacher1234';

        // Hash the default password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // create a User with teacher's name, email, hashedPassword and role = 'teacher'

        const newUser = new User({
            name : savedTeacher.name,
            email : savedTeacher.email,
            password: hashedPassword,
            role : 'teacher',
            teacher : savedTeacher._id //This is the field that is linking the two collections (Users, Teachers)
        });

        // save the new user document
        await newUser.save();

        // Give back a response if the records have been successfully saved.
        res.status(201).json({message : "Teacher and User Accounts created successfully", teacher : savedTeacher})


    }
    catch(err){
        // Handle any errors like the validation error or db errors
        res.status(400).json({message : "Error while adding a teacher", error : err.message})
    }
};

// =========================
// Fetch a teacher based on a teacher's ID
exports.getTeacherById = async (req, res) =>{
    try{
        // Fetch the users id (The person logged in)
        
        // console.log("The Decode details of the user are: ",req.user)
        const userId = req.user.userId;

        // Fetch the details of the user from the collection
        const user =  await User.findById(userId).populate('teacher')

        // check whether he is registered to the db
        if (!user || !user.teacher){
            return res.status(404).json({message : "Teacher not found"})
        }

        const teacher =  user.teacher;
        const teacherId = teacher._id;

        // Below we populate the classes taught by the teacher with the students in there
        const classrooms = await Classroom.find({ teacher: teacherId})
        .populate('students', 'name admissionNumber')

        // Below we also fetch the assignments the teacher has given
        const assignments = await Assignment.find({ postedBy : teacherId })
        .populate('classroom', 'name');

        // return a response to the user
        res.json({teacher, classrooms, assignments})
    }
    catch(err){
        res.status(500).json({message : "Error fetching Teacher Record", error : err.message})
    }
};

// ========================
// Updating the details of a given teacher
exports.updateTeacher = async(req, res)=>{
    try{
        //update teacher with data from the request body
        // return the updated data

        const updatedTeacher =  await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true}
        );

        // check whethe there is any teacher found based on the given id
        if(!updatedTeacher){
            return res.status(404).json({message : "Teacher not found"})
        };

        // work on the logic for updating the teachers password when he has logged in.

        // if the id exists and a successful update has happened, return the new records
        res.json(updatedTeacher)
    }
    catch(err){
        res.status(400).json({message : "Error Updating the teacher", error: err.message})
    }
};

// =======================================
// Deleting a teacher endpoint
// Delink/Unassign

exports.deleteTeacher = async (req, res) =>{
    try{
        // get the teachersId from the passed request with params
        const teacherId = req.params.id
        // console.log("The inserted teachers id is: ", teacherId)

        // Delete  a teacher with the passed Id
        const deletedTeacher = await Teacher.findByIdAndDelete( teacherId );


        // check whether the passed ID exists or not
        if(!deletedTeacher) {
            return res.status(40).json({message : "Teacher not found"})
        };

        // Delink/Unassign the teache from the previously assigned class
        await Classroom.updateMany({ teacher : teacherId }, { $set : {teacher : null}})

        // Delete the teacher record/field inside of the users collection
        await User.findOneAndDelete({ teacher: teacherId})

        // Give a response back to the user if the operation is succcessful
        res.json({message : "Teacher successfully Deleted"})

    }
    catch(err){
        // Handle any error that may have arised from the operation
        res.status(500).json({message : "Error Deleting The Teacher", error : err.message})
    }
};


// ===============================
// We shall get the only  classes a particular teacher is teaching/teaches
exports.getMyClasses = async(req, res)=>{
    try{       
        // Get teacher ID from the Logged in user
         const userId = req.user.userId

        //  find the user and populate the 'teacher reference
        const user = await User.findById(userId).populate('teacher')

        // check if the user exists and is linked to a teacher
        if(!user || !user.teacher){
            return res.status(404).json({message : "Teacher not found."})
        };

        // If the teacher with that id is found, get all the classrooms taught by the this teacher and also
        // include the students therein
        const classes = await Classroom.findById({
            teacher : user.teacher._id
        }).populate('students') ; // We show the students it that particular class

        // give a response back
        res.json(classes)
        

    }
    catch(err){
        // handle any error during the operation
        res.status(500).json({message  : "Error occured", error : err.message})
    }
};


// ===================================
// Below is the route to access the assignments that have been shared by a teacher
exports.getMyAssignments = async(req, res) =>{
    try{

        // Get the users id
        const userId = req.user.userId;

        // find a teacher based on that given id
        const user  = await User.findById(userId).populate('teacher')

        // based on this we are able to tell who posted a given assignment
        const assignments = await Assignment.find({ postedBy : user.teacher._id})
        .populate('classroom') // this includes the classroom details
        .sort({ dueDate : 1 })

        // console.log("The contents of the assignment are: ", assignments)

        res.status(200).json(assignments)
    }
    catch(err){
        // handle any error if any
        res.status(500).json({message : err.message})
    }
};