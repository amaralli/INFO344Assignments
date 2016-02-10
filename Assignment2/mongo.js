'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var dbConfig = require('./secret/config-mongo.json');

var userSchema = new mongoose.Schema({
	email: {type: String, unique: "true", required: "true"},
	password: {type: String, required: "true"},
	displayName: {type: String, required: "true"},
	firstName: String,
	lastName: String,
	oAuth: Boolean,
	gravatarUrl: String
});

var User = mongoose.model('User', userSchema);

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function(err) {
    console.error(err);
});

module.exports = User;