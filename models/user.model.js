'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    
    name : String,
    email: String,
    username: String,
    password: String,

    numFollowing: Number,
    numFollowers: Number,
    numTweets: Number
})

module.exports = mongoose.model("user", UserSchema);
