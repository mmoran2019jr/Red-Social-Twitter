'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'secret';

exports.createToken = function(user){
    var payload={
        sub: user._id,
        name: user.name,
        username: user.username,

        numFollowers: user.numFollowers,
        numFollowing: user.numFollowing,
        
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix()
    }

    return jwt.encode(payload, key);
}