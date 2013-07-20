var models = require('../models');
var User = models.User;

exports.getsBy = function(query, field, opt, callback) {
	User.find(query, field, opt, callback);
};

exports.getBy = function(query, field, callback) {
	User.findOne(query, field).populate({
		path: 'addresses.community',
		model: 'Community'
	}).exec(callback);
};

exports.getById = function(id, callback) {
	User.findById(id).populate({
		path: 'addresses.community',
		model: 'Community'
	}).exec(callback);
};

exports.save = function(username, password, email, avatar_url, active, token, username_index, callback) {
	var user = new User();
	user.username = username;
	user.password = password;
	user.email = email;
	user.active = active;
	user.avatar = avatar_url;
	user.display_name = username;
	user.token = token;
	user.username_index = username_index;

	user.save(callback);
};

exports.update = function(condition, update, callback) {
	User.update(condition, update, callback);
};

exports.updateById = function(id, update, callback) {
	User.findByIdAndUpdate(id, update, callback);
}

exports.getNeighbors = function(condition, opt, callback) {
	User.find(condition, '-password -token -email', opt, callback);
}