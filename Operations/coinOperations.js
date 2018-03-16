const mongoose = require('mongoose')
const Users = require('../models/users')
const missions = require('../models/missions')
const moment = require('moment')
const userOperations = require('../Operations/userOperations')
const missionOperations = require('../Operations/missionOperations')
const dailyCoins = 2;
const videoCoins = 5;





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
				user.coins += dailyCoins;
				user.lastdailybonus = await moment().format('DD/MM/YYYY HH:mm')
				await user.save()
			}

		} catch (err) {
			console.log(err)
		}

	}

}

