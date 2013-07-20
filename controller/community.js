var Community = require('../proxy').Community;
var Group = require('../proxy').Group;

var check = require('validator').check,
	sanitize = require('validator').sanitize;


var msg_error = require('../lib/message').error;

exports.getList = function(req, res, callback) {
	Community.getsBy({}, null, null, function(err, communitys) {
		if (err) {return next(err)};

		if (communitys.length > 0) {
			return res.send(communitys);
		};

		return res.send({error:msg_error.community_not_exit});
	});
};


exports.create = function(req, res, callback) {

	var state = sanitize(req.body.state).trim();
	var city = sanitize(req.body.city).trim();
	var area = sanitize(req.body.area).trim();
	var community = sanitize(req.body.community).trim();

	if (state === '' || city ==='' || area ==='' || community ==='') {
		res.send({error:msg_error.input_empty});
	};

	Community.save(state, city, area, community, function(err, community) {
		if (err) {return next(err)};

		var name = community.community;
		Group.save(name, name+"圈子", 1, req.user._id, community._id, [req.user._id], function(err, group) {
			if (err) {return next(err)};
		});

		return res.send(community);
	});
}