var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/freereward');

var Videos = require('../models/videos')

var videos = [
new Videos(
{
	title:'The Phone Is Changed Forever',
	owner:'Beme news',
	videoId:'scc6_qcMKJI',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos(
{
	title:"WHAT'S INSIDE A $6,000.00 CAMERA?!",
	owner:'Peter McKinnon',
	videoId:'scc6_qcMKJI',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos(
{
	title:'This table basically floats',
	owner:'INSIDER',
	videoId:'h-9wEMa1a2E',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos(
{
	title:'We Did 100 Squats Every Day For 30 Days',
	owner:'BuzzFeedBlue',
	videoId:'c8Q8AyFjWZM',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos(
{
	title:'The Most Satisfying Video in the World 2',
	owner:'Melted Fusion',
	videoId:'0rsjxzPbTGc',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos(
{
	title:'The Most Satisfying Video in the World',
	owner:'Melted Fusion',
	videoId:'Zv4NnN2g7tk',
	viewsCount:0,
	canBeviewed:true,
	maxViews:100000
})
]


for (var i = 0; i < videos.length; i++) {
	videos[i].save(function(err,result){
	
		if(err) return handleError(err)
		if(i == videos.length){
			mongoose.disconnect();
			console.log(result)	
		}
		
	})
	
}


//    function uniqueId() {
//   return 'id-' + Math.random().toString(36).substr(2, 16);
// };

