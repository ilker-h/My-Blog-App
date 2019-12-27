const express = require('express');

const PostController = require('../controllers/posts');

// Note: some of these posts-related routes should be "protected routes" so you should need a valid JWT to use them


// to use the middleware we created, we have to import it and then add it to the methods you want to protect.
// Note: add just checkAuth, not checkAuth(), because we're only passing a reference to the function and Express will execute it
const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file');

const router = express.Router();

// we can pass as many arguments we want and they will execute from left to right
// So we pass in multer as an extra middleware
router.post('', extractFile, checkAuth, PostController.createPost);

// this route is for updating a post. I think '/:id' comes after the base URL '/api/posts', which is set in app.js
router.put('/:id', checkAuth, extractFile, PostController.updatePost);

// this is just a middleware that was attached/registered to the app constant.
// The function is always the last argument and the values passed to the previous arguments
// are filters, and in this case we gave it a URL you must go to in order to run the function.
// This fetches all posts.
router.get('', PostController.getPosts);

// this fetches a single post
router.get('/:id', PostController.getPost);

// :id is a dynamic value and is extracted by Express (the name can be anything, not just id)
// The seconds function is triggered for every request
router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;