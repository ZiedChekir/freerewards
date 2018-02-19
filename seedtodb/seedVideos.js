var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('localhost:27017/ebonus')
var Videos = require('../models/videos')

var videos = [
new Videos(
{
	title:'The Phone Is Changed Forever',
	owner:'Beme news',
	youtubeLink:'https://www.youtube.com/watch?v=scc6_qcMKJI',
	coins:2
}),
new Videos(
{
	title:"WHAT'S INSIDE A $6,000.00 CAMERA?!",
	owner:'Peter McKinnon',
	youtubeLink:'https://www.youtube.com/watch?v=scc6_qcMKJI',
	coins:2
}),
new Videos(
{
	title:'This table basically floats',
	owner:'INSIDER',
	youtubeLink:'https://www.youtube.com/watch?v=h-9wEMa1a2E',
	coins:2
}),
new Videos(
{
	title:'We Did 100 Squats Every Day For 30 Days',
	owner:'BuzzFeedBlue',
	youtubeLink:'https://www.youtube.com/watch?v=c8Q8AyFjWZM',
	coins:2
}),
new Videos(
{
	title:'The Most Satisfying Video in the World 2',
	owner:'Melted Fusion',
	youtubeLink:'https://www.youtube.com/watch?v=0rsjxzPbTGc',
	coins:2
}),
new Videos(
{
	title:'The Most Satisfying Video in the World',
	owner:'Melted Fusion',
	youtubeLink:'https://www.youtube.com/watch?v=Zv4NnN2g7tk',
	coins:2
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

