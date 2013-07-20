var mongoose = require('mongoose');
var config = require('../config').config;
console.log(mongoose.version);

mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
	    process.exit(1);
	}
});

require('./user');
require('./community');
require('./userinfo');
require('./group');
require('./timeline');
require('./photo');


exports.User = mongoose.model('User');
exports.Community = mongoose.model('Community');
exports.UserInfo = mongoose.model('UserInfo');

exports.Group = mongoose.model('Group');

exports.Timeline = mongoose.model('Timeline');
exports.Photo = mongoose.model('Photo');