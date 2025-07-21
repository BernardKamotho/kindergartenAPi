const express = require('express');
const router = express.Router();

// import the parents controller
const parentsController = require('../controllers/parentController');

// import the middleware for security purposes
const { auth, authorizeRoles } = require('../middlewares/auth');



// below is the route to fetch all parents
router.get('/', parentsController.getAllParents);

// Below is the route to add a new parent
router.post('/',auth,authorizeRoles('admin'), parentsController.addParent);

// fetch a parent by us of the parent's ID
router.get('/:id', parentsController.getParentById);

// Update the details of the parent by use of the id
router.put('/:id',auth,authorizeRoles('admin'), parentsController.updateParent);

// Delete  a parent based on the id passed
router.delete('/:id',auth, authorizeRoles('admin'), parentsController.deleteParent);


module.exports = router;