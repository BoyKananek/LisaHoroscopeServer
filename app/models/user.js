var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local : {
        name: String,
        email : String,
        password : String,
    },
    facebook : {
        id  : String,
        email : String,
        name : String
    },
    isNewUser : Boolean,
    sign: String,
    birthday: String
})

//To encode when user sign up 
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
//To compare when user login with password
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.local.password);
}
module.exports = mongoose.model('User',userSchema);