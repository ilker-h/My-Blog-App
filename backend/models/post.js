// The Post model created with mongoose will be the bridge from our NodeJs/Express app and its code
// to the mongoDB database without us writing any mongo code

const mongoose = require('mongoose');

// creating a schema
const postSchema = mongoose.Schema({
    // title: String <--- in Typescript, it's "string", in NodeJs and JS, it's "String"
    title: { type: String, required: true }, // can learn more in mongoose's docs
    content: { type: String, required: true },
    imagePath: { type: String, required: true},
     // the type of this is "Mongoose Object ID" object. This is a static type.
    //  The "ref" property tells Mongoose to which model this ID will belong to (User model in this case).
    // This is "adding a reference to the model"
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

// mongoose needs a model in order to work with it. The schema is just a blueprint, which isn't
//  what we work with in our code.
// Also, the model() method gives us a constructor function which allows us to construct a new JS object
module.exports = mongoose.model('Post', postSchema);