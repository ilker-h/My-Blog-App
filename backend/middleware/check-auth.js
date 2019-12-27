// this is a function which will parse the request and then decide whether the request is allowed to continue
// or if it should be rejected. So it checks if the user is authenticated or not (logged in or not)

// we need to check if we have a JWT and if that JWT is valid

const jwt = require('jsonwebtoken');

// we're exporting it so we can use this middleware in other files (this is a typical NodeJS syntax for a middleware, multer also does this).
// The "res" is a response object which would allow us to create a response.
// The "next" is something we could call if the request should be allowed to continue
module.exports = (req, res, next) => {

    try {
        // authorization header
        // the convention is to assign a value to the header which uses the word then the token ("Bearer ____TOKEN____").
        // the split(' ') is to split it after the word "Bearer" and the [1] is the part after the white space, so the token.
        // Another alternative is to get the token as a query parameter like const token = req.query.auth
        const token = req.headers.authorization.split(' ')[1];

        // verify the token (will throw an error if it fails and will go the the catch() block).
        // Note: the verify() method also happens to decode the token (meaning we can get access to the things
        // that were encoded into the token in routes/user.js, the email and user ID)
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        // we're adding the email and user ID into the request as a new field that we made. This means every middleware 
        // that runs after this check-auth.js middleware will have access to these fields
        req.userData = { email: decodedToken.email, userId: decodedToken.userId}

        // if it does not fail, we called next() to let the execution continue and the request will carry on
        next();
    } catch (error) {
        res.status(401).json({ message: 'You are not authenticated!' });
    }



};