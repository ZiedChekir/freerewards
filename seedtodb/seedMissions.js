var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/freereward');

var Missions = require('../models/missions')
var shortid = require('shortid');



var missions = [
				new Missions(
			
				{
					title:'clans of clans',
					description:'Join millions of players to build a village, form a clan and participate in epic clan wars!',
					link:'play.google.com/store/apps/details?id=com.supercell.clashofclans',
					coins: 50,
					missionId:shortid.generate(),
					imgname:'clashofclans.jpg'
				}),
	

				new Missions({
					title:'starcraft 2',
					description:'Wage war across the galaxy with three unique and powerful races. StarCraft II is a real-time strategy game from Blizzard Entertainment for the PC and Mac.',
					link:'starcraft2.com',
					coins:30,
					missionId:shortid.generate(),
					imgname:'starcraft.jpg'
				}),
				new Missions({
					title:'Travian',
					description:'JOIN THE FAMOUS EXPERT STRATEGY GAM The true MMO pioneer with thousands of real players!',
					link:'www.travian.com',
					coins:50,
					missionId:shortid.generate(),
					imgname:'travian.jpg'
				}),
				new Missions({
					title:'world of warcraft',
					description:"War is coming, and both factions are in dire need of new allies",
					link:'worldofwarcraft.com',
					coins:50,
					missionId:shortid.generate(),
					imgname:'wow.jpg'
				}),

				new Missions({
					title:'tinder',
					description:'Meeting site Need a Partner than this site is ideal for you just sign up and start chatting with other people',
					link:'tinder.com',
					coins:10,
					missionId:shortid.generate(),
					imgname:'tinder.jpg'
				}),
			
			]


for (var i = 0; i < missions.length; i++) {
	missions[i].save(function(err,result){
		if(err) console.log(err)
		if (i == missions.length){
			
			console.log(result);
			mongoose.disconnect();
		}
	});
}
