const express = require("express");
const router = express.Router();
const statsTeacher = require("../controllers/statsTeacherController");
const { auth, authorizeRoles} = require("../middlewares/auth")

router.get("/",auth, statsTeacher.getTeacherStats);



module.exports = router;