'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var dbConfig = require('./secret/config-mongo.json');

var userSchema = new mongoose.Schema({
	email: {type: String, unique: "true", required: "true"},
	password: {type: String, required: "true"},
	displayName: {type: String, required: "true"},
	phone: Number
});

var User = mongoose.model('User', userSchema);

/*userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};*/

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function(err) {
    console.error(err);
});