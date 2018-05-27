var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var games = require('../models/games');
const ensureLoggedIn = require('../config/connect-ensure-login.1/lib/ensureLoggedIn')()
const ensureLoggedOut = require('../config/connect-ensure-login.1/lib/ensureLoggedOut')()
var User = require('../models/users');
var Orders = require('../models/orders')



router.get('/', function (req, res) {
	games.find(function (err, aviableGames) {
		res.render('prizes/games', {
			helpers: {
				truncate: function (str, len) {
					if (str.length > len) {
						var new_str = str.substr(0, len + 1);

						while (new_str.length) {
							var ch = new_str.substr(-1);
							new_str = new_str.substr(0, -1);

							if (ch == ' ') {
								break;
							}
						}

						if (new_str == '') {
							new_str = str.substr(0, len);
						}

						return new_str.toLowerCase() + '...';
					}
					return str;
				}
			},
			games: aviableGames
		});
	})

});
router.get('/search', async function (req, res) {
	var sort = req.query.sort
	var searchquery = req.query.search
	var sortOption
		
	if (sort == "recent") {
		sortOption = {'created_at':"desc"}
	} else if (sort == 'oldest') {
		sortOption = {'created_at':"asc"}
	}else if(sort == "popular"){
		sortOption = {'popularity':"desc"}
	} 
	else {
		sortOption = {}
	}
	
	var aviableGames = await games.find({
		"$or": [{
			"title": {
				"$regex": searchquery,
				"$options": "i"
			}
		}, {
			"description": {
				"$regex": searchquery,
				"$options": "i"
			}
		}]
	}).sort(sortOption)



	res.render('prizes/games', {
		helpers: {
			truncate: function (str, len) {
				if (str.length > len) {
					var new_str = str.substr(0, len + 1);

					while (new_str.length) {
						var ch = new_str.substr(-1);
						new_str = new_str.substr(0, -1);

						if (ch == ' ') {
							break;
						}
					}

					if (new_str == '') {
						new_str = str.substr(0, len);
					}

					return new_str.toLowerCase() + '...';
				}
				return str;
			}
		},
		searchInput: req.query.search,
		games: aviableGames,
		sortBy: sort
	})


});
router.get('/:game', function (req, res) {
	var game = req.params.game;
	games.findOne({
		title: game
	}, function (err, game) {
		if (err) return next(err)
		res.render('prizes/gameinfo', {
			game: game,
			ableToBuy: ableToBuy(res.locals.usercoins, game.price)
		});
	})
});

// router.get('/:game/redeem', ensureLoggedIn, function (req, res) {
// 	var game = req.params.game;
// 	games.findOne({ title: game }, function (err, game) {
// 		if (err) return next(err)

// 		if (game && ableToBuy(res.locals.usercoins, game.price)) {
// 			res.render('prizes/redeem', { game: game })
// 		} else {
// 			res.redirect('/prizes')
// 		}


// 	})

// })
router.post('/:game/redeem/confirm', ensureLoggedIn, function (req, res, next) {
		var gameParam = req.params.game;

		games.findOne({
			title: gameParam
		}, function (err, game) {
			if (err) {
				next(err)
				req.flash('error', 'game not found')
				return res.redirect('/prizes')
			}
			User.findOne({
				'_id': res.locals.user._id
			}, async function (err, user) {
				if (err) return next(err);
				if (user.totalCoins >= game.price) {

					//under this line the encrypted value of coins gets decrypted ,  added some number, encrypted it again and stored it in a variable
					user.totalCoins = user.totalCoins - game.price;
					user.save(function (err) { // user coins saved to database
						if (err) {
							req.flash('error', 'an error occured while purchasing the game. please contact us')
							next(err)
						}
						return res.redirect('/profile/orders')
					});

					var order = new Orders({
						userId:user._id,
						game: game.title,
						gameId: game._id,
						price: game.price,
						completed: false
					})
					order.save(function (err) {
						if (err) return next(err)
					})
					game.popularity += 1;
					game.save(function (err) {
						if (err) next(err)
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

function SortedBy(sort) {

	if (sort == 'recent') {
		return 'desc'
	} else if (sort == 'oldest') {
		return 'asc'
	} else {
		return false;
	}

}