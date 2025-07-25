const { User, Parent, Student, Assignment, Classroom} = require("../models/SchoolDb");

// Get the parents dashboard info
exports.getParentDashboard = async (req, res) =>{
    try{

        // get the id of the parent who has signed in. (You will get from the auth)
        const userId = req.user.userId

        // console.log("The details of the logged in parent are: ", req.user)
        // console.log("The logged in Parents ID is: ", userId)
        // find user and populate parent refrence
        const user = await User.findById(userId).populate('parent')

        if(!user || !user.parent){
            return res.status(404).json({message : "Parent Profile not found"})
        }

        // console.log("The deatails of the user: ", user.parent)

        const parent = user.parent

        // get children (students) linked to this parent
        const children = await Student.find({ parent: parent._id })
        .populate('classroom')

        // return the children as a response
        res.json({parent, children})
    }
    catch(err){
        // handle any error if any
        res.status(500).json({message : "Error fetchind dashboard Details", error : err.message})
    }
};

// below is the route to the assignments of the students
exports.getClassAssignments = async(req, res)=>{
    try{
        // get the class id as params
        const classId = req.params.id;

        console.log("The class id is: ", classId)

        // fetch assignments that are posted in that class including the teachers details
        const assignments = await Assignment.find({ classroom : classId })
        .populate('postedBy')
        .sort({ dueDate: 1 })

        res.json(assignments)
    }
    catch(err){
        // handle any error arising
        res.status(500).json({message : "Error Fetching the assignments", error : err.message})
    }
};