const { Student, Classroom, Parent } = require("../models/SchoolDb");
// Import the multer module
const multer = require('multer');

// import the file system module
const fs = require('fs');

// import the path module so as to get the path of the image
const path = require("path");

// Below is the function to fetch all students
exports.getAllStudents = async(req, res)=>{
    try{
        // we shall use the find function
        const students = await Student.find()
        .populate('classroom')
        .populate('parent')

        // return the same as a response
        res.json(students)
    }
    catch(err){
        // handle any error
        res.status(500).json({message : "Error Fetching Students", error : err.message})
    }
};




// Below is the function to add a students
// By use of the multer module, configure the storage folder of the images
const upload = multer({ dest : 'uploads/'})
exports.uploadStudentPhoto = upload.single('photo')

exports.addStudent = async(req, res) =>{
    try{
        // Destructure the details coming from the passed request (postman/insomnia)
        const { name, dateOfBirth, gender, admissionNumber, parentNationalID, classroomId} = req.body

        console.log(name, dateOfBirth, gender, admissionNumber, parentNationalID, classroomId)
        // Step 1: 
        // find the Parent by use of the national ID
        const parent = await Parent.findOne({nationalID : parentNationalID})
        if(!parent) {
            return res.status(400).json({message : "Parent with the given ID does not Exist."})
        }

        // Step 2: 
        // Check whether the admission number a student is been admitted with has been assigned to another student
        const student = await Student.findOne({ admissionNumber })
        if(student){
            return res.status(400).json({message : "Admission number has already been assigned to Another student"})
        }

        // Step 3:
        // check whether the classroom with the given ID exists or not
        const classroom = await Classroom.findById(classroomId)
        if(!classroom){
            return res.status(400).json({message : "Classroom with the Given ID Does not Exist"})
        }

        // Step 4
        // Handle the uploaded photo(rename it with the current timestamp. Return the extension of the photo)
        let photo = null;
        // if(req.file){
        //     const ext = path.extname(req.file.originalname);
        //     const newFilename = Date.now() + ext;
        //     const newPath = path.join('uploads', newFilename)
        //     fs.renameSync(req.file.path, newPath);

        //     photo = newPath.replace(/\\/g, '/')
        // };
            if (req.file && req.file.path) {
                req.body.photo = req.file.path;
            }

        // step 5: create and save the new student
        const newStudent = new Student({
            name,
            dateOfBirth,
            gender,
            admissionNumber,
            photo: req.body.photo, 
            parent : parent._id,
            classroom : classroom._id
        });

        const savedStudent = await newStudent.save();

        // step 6
        // add the student to the classroom if not already added
        if(!classroom.students.includes(savedStudent._id )){
            classroom.students.push(savedStudent._id);
            await classroom.save()
        }

        // if everything goes on well, just give a response
        res.status(201).json({message : "Student Registered Successfully", savedStudent})


    }
    catch(err){
        // handle any error that might occur during the registration process
        res.status(400).json({message : "Error Adding a Student", error: err.message})
    }
};


// Get a student by use of the student id
exports.getStudentById = async(req, res) =>{
    try{
        const student = await Student.findById(req.params.id)
        .populate('classroom')
        .populate('parent')

        // check whether that iD is there or not
        if(!student){
            return res.status(404).json({message : "Student not Found"})
        }

        // if the student with the said id is there, show his details
        res.json(student)
    }
    catch(err){
        res.status(500).json({message : "An error occured", error: err.message})
    }
};

// update the details of the student
exports.updateStudentDetails = async(req, res)=>{
    try{
        // the update shall happen based on the id of the student(params)
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, {new : true})

        // check whether the id passed exists or not
        if(!updatedStudent){
            return res.status(404).json({message : "Student not Found"})
        }

        // if the students details have been updated successfully, return the new record
        res.json(updatedStudent)
    }
    catch(err){
        res.status(400).json({message : "Error updating the details of the student", error : err.message})
    }
};


// Below is the route for deleting a student
exports.DeleteAStudent = async(req, res)=>{
    try{
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        // check whether the passed id exists or not
        if(!deletedStudent){
            return res.status(404).json({message : "Student not Found"})
        }

        // Remove Student from any classroom
        await Classroom.updateMany(
            {students : deletedStudent._id},
            {$pull : {students : deletedStudent._id}}
        );

        // if the student is successfully delete, return a response
        res.json({message : "Student Records Successfully Deleted."});
    }
    catch(err){
        res.status(500).json({message : "An Error occured.", error: err.message})
    }
};