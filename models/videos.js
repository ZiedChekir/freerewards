var mongoose = require('mongoose')

var VideosSchema = mongoose.Schema({

	title:{
		required:true,
		type:String
	},
	owner:{
		required:true,
		type:String
	},
	youtubeLink:{
		required:true,
		type:String
	},
	coins:{
		required:true,
		type:Number
	}

},{collection:'Videos'})

var Videos = module.exports = mongoose.model('Videos',VideosSchema)

module.exports.getVideos = function(callback){
	Videos.find(callback)
}
