// this file enables es6 synthax in api.js

var fs = require('fs')

var babelrc = fs.readFileSync('./.babelrc')
var config = JSON.parse(babelrc)
require('babel-register')(config)

require('./api/api')
