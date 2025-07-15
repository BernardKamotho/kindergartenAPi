// import the classroom schema
const { Classroom } = require("../models/SchoolDb");

// Implement the CRUD operations for the class
//add a new classroom

exports.addClassroom = async (req, res)=>{
    try{

        // const { name, gradeLevel, classYear } = req.body;
        // console.log(name, gradeLevel, classYear)
        // console.log("It contains ",req.body)

        // Create a new classroom using the request data
        const newClassroom = new Classroom(req.body);

        // save the new classroom to the database
        const savedClassroom = await newClassroom.save()

        // return the saved classroom as a response
        res.status(201).json(savedClassroom)

    }
    catch(err){
        res.status(400).json({message :  "Error adding a class", error : err.message})
    }
}

// ===============================
// Fetch/get all the classrooms
exports.getAllClassrooms = async (req, res) =>{
    try{
        // by use of the function find we can fetch all the classrooms
        const classrooms = await Classroom.find()
        .populate('teacher', 'name email phone')

        // return all the classrooms
        res.json(classrooms)
    }
    catch(err){
        res.status(500).json({message : "Error fetching classrooms", error : err.message})
    }
};

// ===================================
// Fetch a classroom based on an ID
exports.getClassroomById = async (req, res)=>{
    try{
        // we shall use the findById() function to do this.
        // The id we shall pass it as a parameter on the url
        const classroom = await Classroom.findById( req.params.id )
        .populate('teacher', 'name email phone')

        console.log("The content of the classroom is: ", classroom)


        // if the classroom is not found just return a response
        if(!classroom){
            return res.status(404).json({message : "Classroom not Found"})
        };

        // if the class is there, just return the details of the classroom
        res.json(classroom);
    }
    catch(err){
        res.status(500).json({message : "Error fetching the classroom", error : err.message})
    }
};

// ====================================
// Updating a classroom
// Below is the endpoint
exports.updateClassroom = async (req, res)=>{
    try{
        // We shall use the function findByIdAndUpdate
        const updateClassroom = await Classroom.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true} //Return the updated document
        );

        // console.log(updateClassroom)

        //Check whether the classroom with the given id exists?
        if(!updateClassroom){
            return res.status(404).json({message : "Classroom not Found, Check the ID"})
        }

        //if the classroom is there, return the updated record
        res.json(updateClassroom)
    }
    catch(err){
        res.status(400).json({message : "Error Updating a classroom", error : err.message})
    }
};



// =======================
// Delete a classroombased on ID
exports.deleteClassroom = async (req, res)=>{
    try{
        // We shall the function findByIdAndDelete()
        const deletedClassroom = await Classroom.findByIdAndDelete( req.params.id )

        //Check the classroom whether it exists or not before deleting
        if(!deletedClassroom) {
            return res.status(404).json({message : "Classroom not Found"})
        };

        // if the classroom exists and has been successfully deleted, give a response
        res.json({message : "Classroom successfully deleted"});
    }
    catch(err){
        res.status(500).json({message : "Error Deleting a classroom", error : err.message})
    }
};