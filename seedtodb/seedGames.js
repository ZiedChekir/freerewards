var game = require('../models/games');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/freereward');

var games= [
new game({
	title:'counter strike go',
	imgPath:'https://www.vossey.com/userfiles/images/csgo-giveaway.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur ',
	category:'game',
	information:'13+',
	price:2000
}),
new game({
	title:'fifa 18',
	imgPath:'/images/fifa18.jpg',
	description:'nostrud exercitation ullamco',
	category:'game',
	information:'13+',
	price:2600,
	
}),
new game({
	title:"player's unkown battleground",
	imgPath:'/images/pubg.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit,',
	category:'game',
	information:'13+',
	price:4000
}),
new game({
	title:'minecraft',
	imgPath:'/images/minecraft.jpg',
	description:'description is a bitch yaaa ',
	category:'game',
	information:'13+',
	price:1800
}),
new game({
	title:'rocket league',
	imgPath:'/images/rocketleague.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ',
	category:'game',
	information:'13+',
	price:2000
})

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
