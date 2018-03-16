var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		required:true
	},
	password: {
		type: String,
		required:true
	},
	email: {
		type: String,
		required:true
	},
	name: {
		type: String,
		required:true
	},
	coins: {
		type:Number,
		required:true
	},
	joindate: {
		type:String,
		required:true
	},
	lastdailybonus:{
		type:String,
		required:true
	},

	completedMissions:{
		type:Array,
		required:false
	},
	profileimgurl:{
		type:String,
		required:true
	}
},{collection:'users'});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});

}
module.exports.hashandsave = function(user,passToHash,callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(passToHash, salt, function(err, hash) {
	        user.password = hash;
	        user.save(callback);
	    });
	});
}
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}