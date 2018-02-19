var mongoose = require('mongoose')

var MissionsSchema = mongoose.Schema({
	missions:{
		type:Array,
		required:true		
	},
	daily:{
		required:true,
		type:String
	},
	videos:{
		required:true,
		type:String
	}
},{collection:'Missions'})

var Missions = module.exports = mongoose.model('Missions',MissionsSchema)

module.exports.getMissions = function(callback){
	Missions.findOne({'_id':'5a7c250f05f40134e477f549'},callback)
}
