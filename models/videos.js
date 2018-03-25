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
	videoId:{
		required:true,
		type:String
	},
	viewsCount:{
		required:true,
		type:Number
	},
	canBeviewed:{
		required:true,
		type:Boolean
		
	},
	maxViews:{
		required:true,
		type:Number
	}

},{collection:'Videos'})

var Videos = module.exports = mongoose.model('Videos',VideosSchema)

module.exports.getVideos = function(){
	Videos.find()
}
