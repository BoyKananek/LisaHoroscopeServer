var mongoose  = require('mongoose');

var tempUser = mongoose.Schema({
    id : String,
    name : String,
    email : String,
    password : String
});

module.exports = mongoose.model('TempUser',tempUser);