var Users = require('../models/users')

module.exports = {
	queryByEmail: async (email) => {
		try {
			let user = await Users.findOne({ email: email })
			return user
		} catch (err) {
			return null
		}


	},
	queryByUsername: async (username) => {
		try {
			let user = await Users.findOne({ username: username })
			return user
		} catch (err) {
			return null
		}


	},
	queryById: async (id) => {
		try {
			let user = await Users.findOne({ _id: id })
			return user
		} catch (err) {
			return null
		}



	}
}