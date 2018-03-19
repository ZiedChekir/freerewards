var game = require('../models/games');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://zied:zied1478963!@ds151024.mlab.com:51024/freerewards');

var games= [
new game({
	title:'cs1.6',
	imgPath:'https://www.vossey.com/userfiles/images/csgo-giveaway.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur ',
	category:'game',
	information:'13+',
	price:2000
}),
new game({
	title:'fifa 16',
	imgPath:'/images/fifa18.jpg',
	description:'nostrud exercitation ullamco',
	category:'game',
	information:'13+',
	price:2600,
	
}),
// new game({
// 	title:"Player Unknown's Battleground",
// 	imgPath:'/images/pubg.jpg',
// 	description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit,',
// 	category:'game',
// 	information:'13+',
// 	price:4000
// }),
// new game({
// 	title:'Minecraft',
// 	imgPath:'/images/minecraft.jpg',
// 	description:'description is a bitch yaaa ',
// 	category:'game',
// 	information:'13+',
// 	price:1800
// }),
// new game({
// 	title:'Rocket League',
// 	imgPath:'/images/rocketleague.jpg',
// 	description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ',
// 	category:'game',
// 	information:'13+',
// 	price:2000
// })

];

for (var i = 0; i < games.length; i++) {
	games[i].save(function(err,result){
		if(err) return console.log(err)
		if (i == games.length){
			
			console.log(result);
			mongoose.disconnect();
		}
	});
}
