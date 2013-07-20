var models = require('../models');
var Community = models.Community;

exports.getAll = function(callback) {
	Community.find({},callback);
}

exports.getBy = function(query, field, callback) {
	Community.findOne(query, field, callback);
};

exports.getsBy = function(query, field, opt, callback) {
	Community.find(query, field, opt, callback);
};

exports.getById = function(id, callback) {
	Community.findById(id, callback);
};

exports.save = function(state, city, area, community, callback) {
	var community = new Community;
	community.state = state;
	community.city = city;
	community.area = area;
	community.community = community;

	community.save(callback);
}