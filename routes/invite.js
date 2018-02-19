var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut();


router.get('/',ensureLoggedIn,  function(req, res)  {
	res.render('invite',{invite:true})
});


module.exports = router;