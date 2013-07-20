var models = require('../models');
var UserInfo = models.UserInfo;

exports.getBy = function(query, field, callback) {
	UserInfo.findOne(query, field, callback);
};

exports.getsBy = function(query, field, opt, callback) {
	UserInfo.find(query, field, opt, callback);
};

exports.save = function(user, address, community, callback) {
	var userinfo = new UserInfo;
	userinfo.user = user;
	userinfo.address = address;
	userinfo.community = community;

	userinfo.save(callback);
};