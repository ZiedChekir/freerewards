var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://zied:zied1478963!@ds151024.mlab.com:51024/freerewards');

var Missions = require('../models/missions')
var shortid = require('shortid');



var missions = [
				new Missions(
			
				{
					title:'clas of clans',
					description:'bdazleazeqsdbqsdqsdsqdqs',
					link:'www.example.com',
					coins: 50,
					id:shortid.generate()
				}),
				new Missions({
					title:'Meeting site',
					description:'sdqsqd',
					link:'www.exa15623mple.com',
					coins:10,
					id:shortid.generate()
				}),

				new Missions({
					title:'car.forlive account',
					description:'bdazsqdqsdqsdbqsdqsdsqdqs',
					link:'www.45230.com',
					coins:30,
					id:shortid.generate()
				}),
				new Missions({
					title:'happy night',
					description:'bcouccous',
					link:'www.ferrari.com',
					coins:50,
					id:shortid.generate()
				}),
				new Missions({
					title:'world of warcraft',
					description:"sdqsjldkjp^jzaijnf",
					link:'www.haudsik.com',
					coins:50,
					id:shortid.generate()
				})

			
			
			]


for (var i = 0; i < missions.length; i++) {
	missions[i].save(function(err,result){
		if(err) console.log(err)
		if (i == missions.length){
			
			console.log(result);
			mongoose.disconnect();
		}
	});
}
