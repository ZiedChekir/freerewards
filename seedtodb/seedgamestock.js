var game = require('../models/games');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://zied:zied1478963!@ds151024.mlab.com:51024/freerewards');

var gamestock = new mongoose.Schema({
	games:{
        counter_strike_go:{type:Array},
        player_unkown_battleground:{type:Array},
        minecraft:{type:Array},
        fifa_18:{type:Array},
        rocket_league:{type:Array}
    },
    giftcards:{
        steam:{type:Array},
        playsotre:{type:Array}

    }
},{collection:'gamestock'})
var gameStock = mongoose.model('gamestock',gamestock)

var gameStock= new gameStock({
	games:{
		 counter_strike_go:["Z234-23EZD-SQDK21","JHSO-éjd,cs-é","dsqd--sqd-qsd-sqd-","dsqdsqd-qsdqsbb-qd4"],
        player_unkown_battleground:["Z234-23EZD-SQDK21","JHSO-éjd,cs-é","dsqd--sqd-qsd-sqd-","dsqdsqd-qsdqsbb-qd4"],
        minecraft:["Z234-23EZD-SQDK21","JHSO-éjd,cs-é","dsqd--sqd-qsd-sqd-","dsqdsqd-qsdqsbb-qd4"],
        fifa_18:["Z234-23EZD-SQDK21","JHSO-éjd,cs-é","dsqd--sqd-qsd-sqd-","dsqdsqd-qsdqsbb-qd4"],
        rocket_league:["Z234-23EZD-SQDK21","JHSO-éjd,cs-é","dsqd--sqd-qsd-sqd-","dsqdsqd-qsdqsbb-qd4"]
	},
	giftcards:{
		steam:['blablabla',"sqmsqd(","jskdjsqjd"],
		playsotre:["djqsdj",",sqdjkeaz"]
	}
})

gameStock.save(function(err){
if (err) {console.log(err)}
})
