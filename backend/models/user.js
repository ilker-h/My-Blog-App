const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// creating a schema
const userSchema = mongoose.Schema({
    // note: "unique" doesn't act as a validator (so it won't give an error), instead, it's to allow Mongoose and
    // MongoDB to do some internal optimizations for performance. "required" is a validator that throws errors though.
    // However, we then downloaded the "mongoose-unique-validator" library which DOES do validation/error-throwing (we use this
    // library as a "plugin" to the schema, in order to add extra functionality to the schema). This plugin will
    // add an extra hook that will check the data before it saves it to the DB.
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// adding a plugin to the schema
userSchema.plugin(uniqueValidator);

// this creates a user model which can be used in other files
module.exports = mongoose.model('User', userSchema);