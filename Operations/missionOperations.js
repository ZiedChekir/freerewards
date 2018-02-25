

const Missions = require('../models/missions')

module.exports = {
	queryMissions: async function () {
		let missions
		missions = await Missions.find({})
		return missions
	},
	queryVideos: async function () {
		let videos
		videos = await Missions.find({})
		return videos[0].videos
	}
}

