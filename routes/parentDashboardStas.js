const express = require("express");
const router = express.Router();
const parentDashController = require("../controllers/parentsDashboardController");
const {auth, authorizeRoles} = require("../middlewares/auth");


// route to get the dashboard stats
router.get("/", auth, parentDashController.getParentDashboard);
router.get("/:id", auth,authorizeRoles("parent"), parentDashController.getClassAssignments )


module.exports = router;