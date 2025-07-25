// This is the entry point of the api
const express = require('express');
const mongoose = require('mongoose');

// import cors~ (cross origin resource sharing) so that the front end and the back can communicate
const cors = require("cors");

// import the dot env
require('dotenv').config();


// create an app based on express
const app = express();
app.use(cors());

// below we allow our API to accept data inform of json format
app.use(express.json());

// import the login routes for the users
const loginRoutes = require("./routes/login");
app.use("/api/auth", loginRoutes);

// import the classroom routes
const classroomRoutes = require("./routes/classroom");
app.use("/api/classrooms", classroomRoutes);

// import teachers routes
const teachersRoutes = require("./routes/teachers");
app.use("/api/teachers", teachersRoutes);


// import the assignment routes
const assignmentRoutes = require("./routes/assignment");
app.use("/api/assignments", assignmentRoutes);

// Specify the parents routes
const parentsRoutes = require("./routes/parent");
app.use("/api/parents", parentsRoutes);

// Specify the routes for fetching students Details
const studentRoutes = require("./routes/student");
app.use("/api/students", studentRoutes);

// specify the routes to the admin dashboard
const adminDashboardRoutes = require("./routes/dashboardAdmin");
app.use("/api/dashboarAdmin", adminDashboardRoutes)

// specify the routes to to teacher dashboard
const teacherDashboard = require("./routes/teacherStats");
app.use("/api/teacherDashboard", teacherDashboard);


// specify the routes for accessing the parents dashboard stats
const parentDashboardRoutes = require("./routes/parentDashboardStas");
app.use("/api/parentDashboard", parentDashboardRoutes)



// Test/establish the connection to the database using the link specified inside of the .env file
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Mongodb successfully connected"))
.catch(err => console.error("MongoDb connection Error", err))


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("The server is running on port: ", PORT);
})