const { User, Classroom, Assignment } = require("../models/SchoolDb");


exports.getTeacherStats = async(req, res)=>{
    try{
        const userId = req.user.userId
        // console.log("The entire details of the teacher: ", req.user)
        // console.log("The logged in teacher id is: ", userId)

        // check whether the is there or nor
        const user = await User.findById(userId)

        if(!user || !user.teacher) {
            return res.status(404).json({message : "Teacher not found or not linked to the user"})
        };

        const teacherID = user.teacher;
        // console.log("Teacher id: ", teacherID)

        // step 2: Aggregate classrooms to get class count and student total
        const classStats = await Classroom.aggregate([
            { $match : {teacher : teacherID}},
            {
                $group : {
                    _id : null,
                    totalClasses : {$sum : 1},
                    totalStudents : {$sum: {$size : "$students"}}
                }
            }
        ]);

        // step 3: Count the assigments
        const totalAssignments = await Assignment.countDocuments({ postedBy : teacherID })

        // give the final response
        const result = {
            totalClasses : classStats[0]?.totalClasses || 0,
            totalStudents : classStats[0]?.totalStudents || 0,
            totalAssignments
        };

        res.json(result)


    }
    catch(err){
        res.status(500).json({message : "An Error Occured", error: err.message})
    }
}