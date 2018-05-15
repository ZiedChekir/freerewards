var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/freereward');
var shortid = require('shortid');
var Videos = require('../models/videos')

var videos = [
new Videos(
{
	
	owner:'kaypea',
	videoId:'0ud3Q2APQ34',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos(
	{
		
		owner:'kaypea',
		videoId:'2nvE8ja9K5w',
		viewsCount:0,
		canBeviewed:true,
		maxViews:10000
	}),
new Videos({
		
		owner:'kaypea',
		videoId:'3MtrtkAluzg',
		viewsCount:0,
		canBeviewed:true,
		maxViews:10000
}),
new Videos({
		
		owner:'kaypea',
		videoId:'IbmaNrSqBsI',
		viewsCount:0,
		canBeviewed:true,
		maxViews:10000
}),
new Videos({
		
		owner:'kaypea',
		videoId:'9raM6Hh6D7s',
		viewsCount:0,
		canBeviewed:true,
		maxViews:10000
}),
new Videos({
		
		owner:'kaypea',
		videoId:'nhjS2mo48tw',
		viewsCount:0,
		canBeviewed:true,
		maxViews:10000
}),
					new Videos(
						{
							
							owner:'kaypea',
							videoId:'B2KKTss4zQo',
							viewsCount:0,
							canBeviewed:true,
							maxViews:10000
						}),
						new Videos(
							{
								
								owner:'kaypea',
								videoId:'YZTSGXIQ9VM',
								viewsCount:0,
								canBeviewed:true,
								maxViews:10000
							}),
							new Videos(
								{
									
									owner:'kaypea',
									videoId:'QznUNHk_4bE',
									viewsCount:0,
									canBeviewed:true,
									maxViews:10000
								}),
								new Videos(
									{
										
										owner:'kaypea',
										videoId:'IjNfj-iw-14',
										viewsCount:0,
										canBeviewed:true,
										maxViews:10000
									}),
									new Videos(
										{
											
											owner:'kaypea',
											videoId:'bgCic46pYtw',
											viewsCount:0,
											canBeviewed:true,
											maxViews:10000
										}),
										new Videos(
											{
												
												owner:'kaypea',
												videoId:'f3K48c6Tpmk',
												viewsCount:0,
												canBeviewed:true,
												maxViews:10000
											}),
											new Videos(
												{
													
													owner:'kaypea',
													videoId:'zg4NSPVNdvk',
													viewsCount:0,
													canBeviewed:true,
													maxViews:10000
												}),
												new Videos(
													{
														
														owner:'kaypea',
														videoId:'zg4NSPVNdvk',
														viewsCount:0,
														canBeviewed:true,
														maxViews:10000
													}),
new Videos({
	owner:'siv HD',
	videoId:'1t0LFKzlOV4',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos({
	owner:'siv HD',
	videoId:'mvs-cbAriU0',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos({
	owner:'siv HD',
	videoId:'qIZNrpKk1UE',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos({
	owner:'siv HD',
	videoId:'H-GpZJNwKz4',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos({
	owner:'siv HD',
	videoId:'e6ftEpYBdqg',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),
new Videos({
	owner:'siv HD',
	videoId:'fgzI7YrrgP8',
	viewsCount:0,
	canBeviewed:true,
	maxViews:10000
}),


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

