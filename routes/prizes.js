var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var games = require('../models/games');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();
var User = require('../models/users');

var Orders = require('../models/orders')



router.get('/', function (req, res) {
	games.find(function (err, aviableGames) {
		res.render('prizes/games', { games: aviableGames, prizes: true });
	})

});
router.get('/:game', function (req, res) {
	var game = req.params.game;

	games.findOne({ title: game }, function (err, game) {

		
		res.render('prizes/gameinfo', { game: game, ableToBuy: ableToBuy(res.locals.usercoins, game.price) });
	})
});

router.get('/:game/redeem', ensureLoggedIn, function (req, res) {
	var game = req.params.game;
	games.findOne({ title: game }, function (err, game) {
		if (err) return handleError(err)

		if (game && ableToBuy(res.locals.usercoins, game.price)) {
			res.render('prizes/redeem', { game: game })
		} else {
			res.redirect('/prizes')
		}


	})

})
router.get('/:game/redeem/confirm', ensureLoggedIn, function (req, res,next) {
	var game = req.params.game;

	games.findOne({ title: game }, function (err, game) {
		if(err){
			next(err)
			req.flash('errors','game not found')
			return 	res.redirect('/prizes')
		}
		User.findOne({ '_id': res.locals.user._id }, async function (err, user) {
			if (err) return handleError(err);
			if (user.coins >= game.price) {
				
				//under this line the encrypted value of coins gets decrypted ,  added some number, encrypted it again and stored it in a variable
				user.coins =  user.coins - game.price;									
				user.save(function (err) { // user coins saved to database
					if (err) handleError(err)
					return res.redirect('/profile')
				});
				var order = new Orders({
					username:user.username,
					email:user.email,
					game:game.title,
					gameId:game._id,
					price :game.price,
					completed:false
				})
				order.save(function(err){
					if(err) return next(err)
				})
			}
		});
	})

	

	}
	
)

function ableToBuy(usercoins, gameprice) {
	return usercoins >= gameprice ? true : false;
}

module.exports = router;

