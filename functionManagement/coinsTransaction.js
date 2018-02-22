const Coins = require('./coins')
const mongoose = require('mongoose')
const Users = require('../models/users')
const coinsInstance = new Coins()
mongoose.Promise = global.Promise
mongoose.createConnection('localhost:27017/ebonus')
const missions = require('../models/missions')
const moment = require('moment')
const userOperations = require('../Operations/userOperations')
const missionOperations = require('../Operations/missionOperations')



 



module.exports = function coinTran(){
	this.updateDailyCoins = async function (userid){
		try{
			let user = await userOperations.queryById(userid)
			let n =moment().format('DD/MM/YYYY hh:mm'); // now 
			let l =  moment(user.lastdailybonus,'DD/MM/YYYY hh:mm').format('DD/MM/YYYY hh:mm') //last time bonus day
			let now = moment(n,'DD/MM/YYYY hh:mm')
			let last = moment(l,'DD/MM/YYYY hh:mm')
			let duration = moment.duration(now.diff(last));
			let hours = duration.asHours();
			if (hours >= 24){
				let missions = await missionOperations.queryMissions()
				user.coins = await coinsInstance.encryptcoins((Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(missions[0].daily))).toString());
				user.lastdailybonus = await moment().format('DD/MM/YYYY HH:mm')
				await user.save()
			}	

		}catch(err){
			console.log(err)
		}	

	},
	this.updateVideoCoins =async function(userid){

try{
		let user = await userOperations.queryById(userid)
		let missions = await missionOperations.queryMissions()
		user.coins = coinsInstance.encryptcoins((Number(coinsInstance.decryptcoins(user.coins)) + Number(coinsInstance.decryptcoins(missions[0].videos))).toString());
		user.save()
}catch(err){
	console.log(err)
}
		
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

