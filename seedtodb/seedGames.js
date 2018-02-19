var game = require('../models/games');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('localhost:27017/ebonus');

var games= [
new game({
	title:'Counter Strike Go',
	imgPath:'https://www.vossey.com/userfiles/images/csgo-giveaway.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur ',
	category:'game',
	information:'13+',
	price:2000
}),
new game({
	title:'Fifa 18',
	imgPath:'/images/fifa18.jpg',
	description:'nostrud exercitation ullamco',
	category:'game',
	information:'13+',
	price:2600
}),
new game({
	title:"Player Unknown's Battleground",
	imgPath:'/images/pubg.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit,',
	category:'game',
	information:'13+',
	price:4000
}),
new game({
	title:'Minecraft',
	imgPath:'/images/minecraft.jpg',
	description:'description is a bitch yaaa ',
	category:'game',
	information:'13+',
	price:1800
}),
new game({
	title:'Rocket League',
	imgPath:'/images/rocketleague.jpg',
	description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, ',
	category:'game',
	information:'13+',
	price:2000
})

];

for (var i = 0; i < games.length; i++) {
	games[i].save(function(err,result){
		if(err) return handleError(err)
		if (i == games.length){
			
			console.log(result);
			mongoose.disconnect();
		}
	});
}
