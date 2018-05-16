var game = require('../models/games');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/freereward');

var games= [
new game({
	title:'counter strike go',
	imgPath:'images/games/csgo.jpg',
	description:'Counter-Strike: Global Offensive (CS: GO) will expand upon the team-based action gameplay that it pioneered when it was launched 14 years ago. CS: GO features new maps, characters, and weapons and delivers updated versions of the classic CS content (de_dust2, etc.). In addition, CS: GO will introduce new gameplay modes, matchmaking, leader boards, and more.',
	category:'game',
	information:'16+',
	price:2000
}),
new game({
	title:'fifa 18',
	imgPath:'/images/games/fifa18.jpg',
	description:'The classic, long running football simulator is back for another year. FIFA 18 brings with it better animations, better physics, polished gameplay, and improved The Journey mode. Become a new football legend, lead your team to the cup, and have your fans crazy about your wonder goals.',
	category:'game',
	information:'3+',
	price:2600,
	
}),
new game({
	title:"PlayerUnknown's Battlegrounds",
	imgPath:'/images/games/pubg.jpg',
	description:"PLAYERUNKNOWN'S BATTLEGROUNDS, or PUBG is a last-man-standing shooter being developed with community feedback. Players must fight to locate weapons and supplies in a massive 8x8 km island to be the lone survivor. This is BATTLE ROYALE.",
	category:'game',
	information:'16+',
	price:4000
}),
new game({
	title:'minecraft',
	imgPath:'/images/games/minecraft.jpg',
	description:'Minecraft is a game about breaking and placing blocks. At first, people built structures to protect against nocturnal monsters, but as the game grew players worked together to create wonderful, imaginative things.',
	category:'game',
	information:'7+',
	price:1800
}),
new game({
	title:'rocket league',
	imgPath:'/images/games/rocketleague.jpg',
	description:'Soccer meets driving once again in the longawaited, physicsbased multiplayerfocused sequel to Supersonic Acrobatic RocketPowered BattleCars Choose a variety of highflying vehicles equipped with huge rocket boosters to score amazing aerial goals and pulloff incredible gamechanging saves ',
	category:'game',
	information:'3+',
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
