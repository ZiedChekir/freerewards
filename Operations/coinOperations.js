const coinsEncryption = require('./encryptCoins')
const mongoose = require('mongoose')
const Users = require('../models/users')
const missions = require('../models/missions')
const moment = require('moment')
const userOperations = require('../Operations/userOperations')
const missionOperations = require('../Operations/missionOperations')







module.exports = {
	updateDailyCoins: async function (userid) {
		try {
			let user = await userOperations.queryById(userid)
			let n = moment().format('DD/MM/YYYY hh:mm'); // now 
			let l = moment(user.lastdailybonus, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY hh:mm') //last time bonus day
			let now = moment(n, 'DD/MM/YYYY hh:mm')
			let last = moment(l, 'DD/MM/YYYY hh:mm')
			let duration = moment.duration(now.diff(last));
			let hours = duration.asHours();
			if (hours >= 24) {
				let missions = await missionOperations.queryMissions()
				user.coins = await coinsEncryption.encryptcoins((Number(coinsEncryption.decryptcoins(user.coins)) + Number(coinsEncryption.decryptcoins(missions[0].daily))).toString());
				user.lastdailybonus = await moment().format('DD/MM/YYYY HH:mm')
				await user.save()
			}

		} catch (err) {
			console.log(err)
		}

	},
	updateVideoCoins: async function (userid) {

		try {
			let user = await userOperations.queryById(userid)
			let missions = await missionOperations.queryMissions()
			user.coins = await coinsEncryption.encryptcoins((Number(coinsEncryption.decryptcoins(user.coins)) + Number(coinsEncryption.decryptcoins(missions[0].videos))).toString());
			await user.save()
		} catch (err) {
			console.log(err)
		}

	},
	updateCouponCoin: async function (userid, couponcoins) {
		try {
			let user = await userOperations.queryById(userid)
			user.coins = await coinsEncryption.encryptcoins((Number(coinsEncryption.decryptcoins(user.coins)) + Number(coinsEncryption.decryptcoins(couponcoins))).toString())
			await user.save()
		} catch (err) {
			console.log(err)
		}


	}
}

