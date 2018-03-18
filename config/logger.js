var colors = require('colors/safe');
var debugFunction = require('debug')('log-info')
var debugFT = require('debug')('success')
module.exports = {
  debug: function(text,color){
    debugFunction(colors[color](text))
    }
}