var UserInfo = require('../proxy').UserInfo;
var User = require('../proxy').User;
var Community = require('../proxy').Community;
var Group = require('../proxy').Group;

var check = require('validator').check,
	sanitize = require('validator').sanitize;


var msg_error = require('../lib/message').error;


exports.createAddress = function(req, res, next) {
	var user = req.user;
	var community = sanitize(req.body.community).trim();
	var address = sanitize(req.body.address).trim();
	address = sanitize(address).xss();

	if (community === '' || address === '') {
		res.send({error: msg_error.input_empty});
	    return;
	};

	Community.getById(community, function(err, community) {
		if (err) {return next(err)};

		if (community == null) {
			return res.send({error: msg_error.community_not_exit});
		};

		var addr = {
			address : address,
			community : community
		};

		var name = community.community;

		Group.getBy({'name' : name, 'community':community._id}, null, function(err, group) {
			if (err) {return next(err)};

			if (group != null) {
				if (group.users.indexOf(user._id) == -1) {
					group.users.push(user._id);
				}

				group.save(function(err, group) {
					if (err) {return next(err)};
				});
			} else {

				Group.save(name, name+"圈子", 1, req.user._id, community._id, [req.user._id], function(err, group) {
					if (err) {return next(err)};
				});
			}
		});


		User.update({_id : req.user._id}, {$push: {addresses : addr}}, function(err, user) {
			if (err) {return next(err)};
			return res.send(user.addresses);
		});
		
	});
};