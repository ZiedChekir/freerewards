

var apiKey = "6d1f984420ca4b25bb062e21e34d93ca"
var baseUrl = "https://api.zerobounce.net/v1";

var request = require('request-promise')

module.exports.getCredits = async function () {
    var uri = baseUrl + "/getcredits" + "?apikey=" + apiKey;   
        var a  = await request(uri)
        return a
}

module.exports.validate = async function (email) {
    var uri = baseUrl + "/validate" + "?apikey=" + apiKey + "&email=" + email;
    var validation = await request(uri)
    return validation
}

module.exports.validateWithIpAddress =async function (email, ipAddress, callback) {
    var uri = baseUrl + "/validate" + "?apikey=" + apiKey + "&email=" + email + "&ipAddress=" + ipAddress;
   var a = await request(uri)
   return a
}


