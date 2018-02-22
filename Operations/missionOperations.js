

const Missions = require('../models/missions')

module.exports ={
	queryMissions: async function(){
		let missions
		missions= await Missions.find({})
		return missions
	}
}

