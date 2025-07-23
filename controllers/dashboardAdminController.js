const { Student, Teacher, Parent, Classroom, User } = require("../models/SchoolDb");


exports.getDashboardStatistics = async (req, res) =>{
    try{
        // Show the total count of different Entries i.e: students, classroom, users, parents, teacher
        const [
            totalStudents,
            totalTeachers,
            totalParents,
            totalClassrooms,
            activeUsers
        ] = 
        await Promise.all(
            [
                Student.countDocuments(),
                Teacher.countDocuments(),
                Parent.countDocuments(),
                Classroom.countDocuments(),
                User.countDocuments({isActive : true})
            ]
        );

        // Show the admin the students from the recently added
        const recentStudents = await Student.find()
        .sort({ createdAt : -1 })
        .limit(5)

         // Return the teachers records based on how they have been added to the database.
         const recentTeachers = await Teacher.find()
         .sort( { createdAt : -1 } )
         .limit(5)

        // Return all the stat in a single response
        res.json({
            totalStudents,
            totalTeachers,
            totalParents,
            totalClassrooms,
            activeUsers,
            recentStudents,
            recentTeachers
        })

       

    }
    catch(err){
        res.status(500).json({message : "Failed to Load Admin Dashboard Statistics", error : err.message})
    }
};