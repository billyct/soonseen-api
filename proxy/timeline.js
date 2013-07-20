var models = require('../models');
var Timeline = models.Timeline;



exports.getBy = function(query, field, callback) {
	Timeline.findOne(query, field, callback);
};

exports.getsBy = function(query, field, opt, callback) {
	Timeline.find(query, field, opt).populate({
		path: 'user',
		select: '-password -token -email',
		model: 'User'
	}).populate({
		path: 'comments.user',
		select: '-password -token -email',
		model: 'User'
	}).populate({
		path: 'groups',
		model: 'Group'
	}).populate({
		path: 'photos',
		model: 'Photo'
	}).exec(callback);
};

exports.getById = function(id, callback) {
	Timeline.findById(id).populate({
		path: 'user',
		select: '-password -token -email',
		model: 'User'
	}).populate({
		path: 'comments.user',
		select: '-password -token -email',
		model: 'User'
	}).populate({
		path: 'groups',
		model: 'Group'
	}).populate({
		path: 'photos',
		model: 'Photo'
	}).exec(callback);
}

exports.save = function(user, groups, title, content, photos, tags, callback) {
	var timeline = new Timeline;
	timeline.user = user;
	timeline.groups = groups;
	timeline.title = title;
	timeline.content = content;
	timeline.photos = photos;
	timeline.tags = tags;

	timeline.save(callback);
};
exports.update = function(condition, update, callback) {
	Timeline.update(condition, update, callback);
};

exports.remove = function(condition, callback) {
	Timeline.remove(condition, callback);
}

exports.count = function(condition, callback) {
	Timeline.count(condition, callback);
}

exports.aggregate = function(pl, cb) {
	Timeline.aggregate(pl, {}, cb);
}