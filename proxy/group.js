var models = require('../models');
var Group = models.Group;

exports.getsBy = function(query, field, opt, callback) {
	Group.find(query, field, opt, callback);
};

exports.getBy = function(query, field, callback) {
	Group.findOne(query, field, callback);
};

exports.getById = function(id, callback) {
	Group.findById(id, callback);
};

exports.save = function(name, description, access, user, community, users, callback) {
	var group = new Group();
	group.name = name;
	group.description = description;
	group.access = access;
	group.user = user;
	group.community = community;
	group.users = users;

	group.save(callback);
};

exports.remove = function(condition, callback) {
	Group.remove(condition, callback);
}

exports.getMembers = function(id, callback) {

	Group.findById(id, 'users').populate({
		path: 'users',
		select: '-password -token -email',
		model: 'User'
	}).exec(callback);

}