var models = require('../models');
var Photo = models.Photo;

exports.getAll = function(callback) {
	Photo.find({},callback);
}

exports.getBy = function(query, field, callback) {
	Photo.findOne(query, field, callback);
};

exports.getsBy = function(query, field, opt, callback) {
	Photo.find(query, field, opt, callback);
};

exports.getById = function(id, callback) {
	Photo.findById(id, callback);
};

exports.save = function(user, path, path_thumb, callback) {
	var photo = new Photo;
	photo.user = user;
	photo.path = path;
	photo.path_thumb = path_thumb;

	photo.save(callback);
}

exports.count = function(condition, callback) {
	Photo.count(condition, callback);
}