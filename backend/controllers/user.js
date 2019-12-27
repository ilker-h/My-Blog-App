// this file's job is to handle the user-related logic so that the logic doesn't have to be placed inside
// one of the files in the "routes" folder. This doesn't mean the routing logic, only the methods/middlewares

// we don't need Express here because that's only needed for the router
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


// this is another type of syntax for exporting
exports.createUser = (req, res, next) => {
    // the number is the Salt or Rounds, meaning the higher the number here, the longer it will take but the
    // safer it will be because it generates a random number and generates a hash.
    // After hashing the password, we save the user in the DB
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    });
                });

        });


    // doing this would be very bad because we would be storing the password in an unencrypted, raw way in the DB.
    // 
    // password: req.body.password
    // 
    // So instead, we have to hash it so it's encrypted and can't be reversed, or decrypted
    // that's why we download the "bcrypt" library which offers encryption
}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        // we use .then() in the case that we get a response (which would be the "user" parameter).
        // So if we have a user then we have that email address, otherwise if we don't find an email, that means
        // we don't have a user
        .then(user => {
            // console.log(user); // note: this logs it into the terminal's console, not Chrome's console

            if (!user) {
                // we're adding a "return" keyword because we're adding code after this
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            fetchedUser = user;
            // so if we did find a user with the email address that was entered then. So we have to compare the
            // password entered into the login form with the password stored in the DB. However, the password in the
            // DB has been hashed. However, since the bcrypt package was the one who hashed it, then if you use the
            // same algorithm on the same input, then that'll result in the same hash (so you can compare the hash stored
            // in the DB with the new hash you generate for the input the user just entered). This way, we don't need
            // to decrypt (which isn't even possible) the password to find out
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            // console.log(result);
            // we know "result" is a boolean
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            // now that we're sending the JWT to the client, we have to receive it in our Angular app.
            // Note: this userId here is encoded into the token, and we're not encrypting this token so
            // that means we can decode the token and find out the userId in other parts of the app where
            // we may need to know the userId
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
                // For NodeJS, these global variables are injected into the running Node process
                // and there, we can access them on a special object, the process object, which holds
                // an “env” variable which holds all the injected environment variables (including the 
                // ones we defined in our nodemon.json file).
                process.env.JWT_KEY,
                { expiresIn: '1h' });
            res.status(200).json({
                token: token,
                expiresIn: 3600, // 3600 is in seconds. You could also send it like '3600' or '1h' for 1 hour
                // we're passing this user ID here so it's more easily parsable in the frontend but the user ID
                // is encoded in this token anyway so you could technically decode it later too (but that's bad for performance)
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            // console.log(err);
            return res.status(401).json({
                message: 'Invalid Authentication credentials!'
            });
        });
}