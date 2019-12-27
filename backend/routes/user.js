const express = require('express');

const UserController = require('../controllers/user')

const router = express.Router();

// Note: these user-related routes should not be "protected routes" so you shouldn't need a valid JWT to use them

// create a new user and store it in the database whenever we get a new request reaching this route.
// Note: we're not executing the createUser method (to do that we'd have to write createUsers() ),
// we're just passing a reference to it so that Express will register it and execute it whenever a 
// request reaches this route.
router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;