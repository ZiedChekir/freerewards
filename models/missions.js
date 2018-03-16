var mongoose = require('mongoose')

var MissionsSchema = mongoose.Schema({
	id:{
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
	}	
},{collection:'Missions'})

var Missions = module.exports = mongoose.model('Missions',MissionsSchema)

module.exports.getMissions = function(id,callback){
	Missions.find(id,callback)
}
