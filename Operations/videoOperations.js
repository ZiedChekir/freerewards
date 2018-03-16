const userOperations = require('../Operations/userOperations')

const videoCoins = 5;





module.exports = {

	updateVideoCoins: async function (userid) {

		try {
			let user = await userOperations.queryById(userid)
			user.coins += videoCoins;		
			await user.save()
		} catch (err) {
			console.log(err)
		}

	}
}

