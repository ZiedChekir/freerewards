var mongoose = require('mongoose')

var MissionsSchema = mongoose.Schema({
	missionId:{
		type:String,
		required:true
	},
	coins:{
		type:Number,
		required:true
	},
	link:{
		type:String,
		required:true
	},
	description:{
		type:String,
		required:true
	},
	title:{
		type:String,
		required:true
	},
	imgname:{
		type:String,
		required:true
	}
},{collection:'missions'})

var Missions = module.exports = mongoose.model('missions',MissionsSchema)

module.exports.getMissions = function(id,callback){
	Missions.find(id,callback)
}
