const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserChema = new Schema(
    {
        name: {
            type: String,
            required:[true, "please enter product name"]  ,
            unique: true
        },
        email: {
            type: String,
            required: [true, "please enter product email"]  ,
            unique: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required:[true, "please enter product password"]  ,
            unique: true
        },
    },
    { timestamps: true }
);

const User =  mongoose.model("Users", UserChema);

module.exports = User;
