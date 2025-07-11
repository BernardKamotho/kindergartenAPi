const express = require("express");
const router = express.Router();


// import the login controller
const loginController = require("../controllers/loginController");

router.post('/', loginController.registerAdmin);
router.post('/login', loginController.login);

// export the router
module.exports = router;