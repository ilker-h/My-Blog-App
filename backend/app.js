const path = require('path'); // lets us construct paths that are safe to run on any operating system
const express = require('express');
const bodyParser = require('body-parser');
// mongoose is the package we use for working with the DB (which includes connecting to it)
const mongoose = require('mongoose');
// var util = require('util') // used for util.inspect()

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express(); // creating an express app

// whenever the node server starts, this connects to MongoDB, and Mongoose will manage the connection for me.
// The connect() method will return a promise.
// "useCreateIndex: true" is from https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/learn/lecture/10540120#questions/6998734
mongoose.connect('mongodb+srv://new-user_4:' + process.env.MONGO_ATLAS_PW + '@cluster0-pvkef.mongodb.net/my-node-angular-test-db?retryWrites=true', { useCreateIndex: true, useNewUrlParser: true })
    .then(
        (response) => {
            console.log('Connected to database! ');
            // JSON.stringify(response) can't convert circular structures to JSON so instead I used util.inspect(response)
            // https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
            // console.log(util.inspect(response)); (which I had to import from a package above)
        }
    ).catch(
        (error) => {
            console.log('Connection failed! ' + error);
            // Note, some ways to solve errors are at https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/learn/lecture/10523088#questions/5639004
            // Also, you may have to go into MongoDB Atlas's IP whitelist and refresh your IP since it changes after a few days
            // (https://cloud.mongodb.com/v2/5cd4d1d379358ed3bc80c95e#clusters/security/whitelist) which happened to me
        }
    );

app.use(bodyParser.json());
// bodyParser is also able to parse different types of body responses, not just JSON
app.use(bodyParser.urlencoded({ extended: false }));
// this is the static middleware, which means any requests targetting
// /images will be allowed to continue and fetch their files from there.
// Requests going to /images are forwarded to 'backend/images'
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    // in order to avoid Cross Origin Resource Sharing (CORS) errors, allow any server to
    // access the resources on our node server (so that anyone from any computer can access the web app)
    res.setHeader('Access-Control-Allow-Origin', '*');
    // an additional criteria is that the incoming response must have one or more of these headers
    // in order to be allowed:
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // allow these methods when another server accesses the resources on our node server:
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, PUT, OPTIONS');
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;