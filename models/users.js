var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var shortid = require('shortid');
var Schema = mongoose.Schema;
// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
		required: [true, 'username is empty'],
		maxlength: 20,
		minlength: 6,
		unique: true
	},
	password: {
		type: String,
		required: [true, 'password is empty']
	},
	email: {
		type: String,
		required: [true, 'email is empty'],
		unique: true
	},
	name: {
		type: String,
		required: [true, 'name is empty']
	},
	joindate: {
		type: String,
		required: true
	},
	lastdailybonus: {
		type: String,
		required: true
	},

	completedMissions: {
		type: Array,
		required: false
	},
	profileimgurl: {
		type: String,
		required: true
	},
	refferedUsers: [{
		_id: false,
		id: {
			type: Schema.ObjectId,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		coins: {
			type: Number
		}
	}],
	refferedBy: {
		type: String,
	},
	refferalUrl: {
		type: String
	},
	Earnedcoins: {
		type: Number,
		required: true,
		default: 0
	},
	childCoins: {
		type: Number,
		required: true,
		default: 0
	},
	totalCoins: {
		type: Number,
		required: true,
		default:0
	},
	emailVerified:{
		type:Boolean,
		default:false,
		required:true
	}

}, { 
	usePushEach: true,
  
	collection: 'users'
});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save(callback)
		});
	});

}
module.exports.hashandsave = function (user, passToHash, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(passToHash, salt, function (err, hash) {
			user.password = hash;
			user.save(callback);
		});
	});
}
module.exports.getUserByUsername = function (username, callback) {
	var query = {
		username: username
	};
	User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
}