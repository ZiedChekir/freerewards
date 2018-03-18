const request = require('request')

module.exports = {
    recapatchaValidation:  function(req,res,next){
        if (process.env.NODE_ENV == 'production') {
            var recapatcha = req.body['g-recaptcha-response']
            if (recapatcha == '' || recapatcha == null || recapatcha == undefined) {
                debug('recapatcha wasnt checked')
                req.flash('errors', 'Make sure to check recapatcha')
                return res.redirect(`/user/login?username=${username}`)
        
            }
            var secretKey = "6LfGQ00UAAAAAAtDN5vTsav_EiQ6Kj8Xsb8vcgV-"
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        
            console.log('before request')
            request(verificationUrl, function (error, res, body) {
                if (body.success !== undefined && !body.success) {
                    debug('success is false')
                    req.flash('errors', 'something went wrong with recapatcha!')
                    return res.redirect(`/user/login?username=${username}`)
        
                }
                if (body.success) {
                    req.flash('success', 'you are now logged in!')
                    next()
                }
        
            })
        } else {
            next()
        }
    }
}


