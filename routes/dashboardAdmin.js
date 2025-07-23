const express = require("express");
const router = express.Router();

// import the admin dashboard controller
const adminDashboardController = require("../controllers/dashboardAdminController");


router.get("/", adminDashboardController.getDashboardStatistics);


module.exports = router;