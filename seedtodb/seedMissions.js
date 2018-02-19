var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('localhost:27017/ebonus')
var Missions = require('../models/missions')

var missions = [
	new Missions({
			missions:[
				{
					title:'clas of clans',
					description:'bdazleazeqsdbqsdqsdsqdqs',
					link:'www.example.com',
					coins:'84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c',
					id:uniqueId()
				},
				{
					title:'Meeting site',
					description:'sdqsqd',
					link:'www.exa15623mple.com',
					coins:'84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c',
					id:uniqueId()
				},
				{
					title:'car.forlive account',
					description:'bdazsqdqsdqsdbqsdqsdsqdqs',
					link:'www.45230.com',
					coins:'84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c',
					id:uniqueId()
				},
				{
					title:'happy night',
					description:'bcouccous',
					link:'www.ferrari.com',
					coins:'84a8bffbee7b26905e4db5417bb00b5f:7bde3a43646d7fdfa170a24d3bdaee9c',
					id:uniqueId()
				},
				{
					title:'world of warcraft',
					description:"sdqsjldkjp^jzaijnf",
					link:'www.haudsik.com',
					coins:'64f84d0d88d443a75c972c5c4fa8f418:227e9f493cd2b5ebece17b8567a19113',
					id:uniqueId()
				}

			],
			daily:'0ba8e7d9a980150da7f772d0fa79a311:bef064dbcd8772306604cfc81bcfca94',
			videos:'e0671db050832865720237ceb0210c80:6117e517d7811785e620a29959daadc9'
	})
]

missions[0].save(function(err,result){
	if(err) return handleError(err)
		console.log(result)
		console.log(err)
		mongoose.disconnect();
})

   function uniqueId() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

