// Specify all the DB schemas
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Below we define the user schema
const userSchema = new Schema({
    name  : {type : String},
    email : {type: String, required: true, unique : true},
    password : {type: String,  required : true},
    isActive : {type: Boolean, default: true},
    role : {type: String, enum : ['admin', 'teacher', 'parent'], require: true},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref : 'Teacher', default : null},
    parent : {type : mongoose.Schema.Types.ObjectId, ref : 'Parent', default : null}
}, {timestamps : true});


// Teacher schema
const teacherSchema = new Schema({
    name : {type : String, required: true},
    email : {type : String},
    phone : {type : String},
    subject : {type : String}
}, {timestamps: true});

// Classroom Schema : name, assigned Teacher, and the students (Arrays- references several of them)
const classroomSchema = new Schema({
    name : {type: String, required: true},
    gradeLevel : {type : String},
    classYear : {type: String},
    teacher : {type: mongoose.Schema.Types.ObjectId, ref : 'Teacher', default:null}, // References a teacher
    students: [{type: mongoose.Schema.Types.ObjectId, ref : 'Student', default:null}] // references students who are taught by the given teacher
}, {timestamps: true});


// Parents Schema
const parentSchema = new Schema({
    name : {type : String, required: true},
    email : {type: String},
    phone: {type: String},
    nationalID : {type: String, required: true, unique: true},
    address : {type: String}
}, {timestamps: true});

// Students Schema
const studentSchema = new Schema({
    name: {type: String, required: true},
    dateOfBirth : {type : Date, required: true},
    gender : {type: String},
    photo : {type : String},
    admissionNumber: {type: String, unique: true},
    classroom : {type : mongoose.Schema.Types.ObjectId, ref : 'Classroom', default:null}, // references a given class based on the id
    parent : {type: mongoose.Schema.Types.ObjectId, ref : 'Parent'} // references a parent based on the id
}, {timestamps: true});


// Assigment Schema
const assignmentSchema = new Schema({
    title : {type: String, required : true},
    description : {type: String},
    dueDate : {type: Date},
    classroom : {type: mongoose.Schema.Types.ObjectId, ref : 'Classroom'}, // references the class assigned
    postedBy : {type: mongoose.Schema.Types.ObjectId, ref : 'Teacher'} // references the teacher who has given the assignment
}, {timestamps: true});


// export the schemas to make them accessible through out the application
const User = mongoose.model('User', userSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Classroom = mongoose.model('Classroom', classroomSchema);
const Parent = mongoose.model('Parent', parentSchema);
const Student = mongoose.model('Student', studentSchema);
const Assignment =mongoose.model('Assignment', assignmentSchema);


module.exports = {User,Teacher, Classroom, Parent, Student, Assignment };

