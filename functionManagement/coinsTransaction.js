var Coins = require('./coins')
var mongoose = require('mongoose')
var Users = require('../models/users')
var coinsInstance = new Coins()
mongoose.Promise = global.Promise
mongoose.createConnection('localhost:27017/ebonus')
var missions = require('../models/missions')
var moment = require('moment')




 



module.exports = function coinTran(){
	this.updateDailyCoins = function (userToQuery){

		Users.findOne({'_id':userToQuery},function(err,user){
			if (err) return handleError(err)
			var n =moment().format('DD/MM/YYYY hh:mm'); // now 
			var l =  moment(user.lastdailybonus,'DD/MM/YYYY hh:mm').format('DD/MM/YYYY hh:mm') //last time bonus day

			var now = moment(n,'DD/MM/YYYY hh:mm')
			let last = moment(l,'DD/MM/YYYY hh:mm')

			var duration = moment.duration(now.diff(last));
			var hours = duration.asHours();
			if (hours >= 24){
				missions.findOne({'_id':'5a7c250f05f40134e477f549'},function(err,result){
					if(err) return handleError(err)			
						user.coins = coinsInstance.encryptcoins((Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(result.daily))).toString());
					user.lastdailybonus = moment().format('DD/MM/YYYY HH:mm')
					user.save(function(err){
						if (err) return handleError(err)
					})			
				})
			}	
		})
	},
	this.updateVideoCoins = function(userid){
		Users.findOne({'_id':userid},function(err,user){
			if (err) return handleError(err)
				if(user){
					missions.findOne({'_id':'5a7c250f05f40134e477f549'},function(err,result){
						if(err) return handleError(err)			
							// user.coins = coinsInstance.encryptcoins((Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(result.vidoes))).toString());
						// console.log(coinsInstance.decryptcoins(user.coins))
						// console.log(coinsInstance.decryptcoins( result.videos))
						user.coins = coinsInstance.encryptcoins((Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(result.videos))).toString());

						// console.log(Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(result.vidoes)))
						user.save(function(err){
							if (err) return handleError(err)
						})			
					})
				}
			})
	},
	this.updateCouponCoin = function(userid,couponcoins){
		Users.findOne({'_id':userid},function(err,user){
			if (err)return handleError(err)
		
			user.coins = coinsInstance.encryptcoins((Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(couponcoins))).toString())
			
			user.save(function(err){
				
							if (err) return handleError(err)
						})	
	})

}
}

