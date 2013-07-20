var Group = require('../proxy').Group;
var UserInfo = require('../proxy').UserInfo;
var User = require('../proxy').User;

var check = require('validator').check,
	sanitize = require('validator').sanitize;


var msg_error = require('../lib/message').error,
	msg_success = require('../lib/message').success;

var _ = require('underscore');

var getCreated = function(req, res, next) {
	var user = req.user;

	Group.getsBy({user: user._id}, null, {sort:{_id: -1}}, function(err, groups) {
		if (err) {return next(err)};

		if (groups.length > 0) {
			return res.send(groups);
		};

		return res.send({error:msg_error.group_not_exit});
	});

};

var getJoined = function(req, res, next) {

	Group.getsBy({users: req.user._id}, null, null, function(err, groups) {
		if (err) {return next(err)};

		if (groups.length > 0) {
			return res.send(groups);
		};

		return res.send({error: msg_error.group_not_exit});
	});
};

var getList = function(req, res, next) {

	var user = req.user;
	var communities = new Array;
	for (var i = user.addresses.length - 1; i >= 0; i--) {
		communities.push(user.addresses[i].community);
	};

	Group.getsBy({community : {$in: communities}}, null, {sort:{_id: -1}}, function(err, groups) {
		if (err) {return next(err)};

		if (groups.length > 0) {
			return res.send(groups);
		}

		return res.send({error: msg_error.group_not_exit});

	});
}

exports.getList = function(req, res, next) {
	var type = sanitize(req.params.type).trim();

	if (type === 'joined') {
		getJoined(req, res, next);
	} else if (type === 'created') {
		getCreated(req, res, next);
	} else {
		getList(req, res, next);
	}
};

exports.get = function(req, res, next) {
	var id = req.params.id;

	Group.getById(id, function(err, group) {
		if (err) {return next(err)};
		if (group == null) {
			res.send({error:  msg_error.group_not_exit});
		};

		res.send(group);
	})
}

exports.join = function(req, res, next) {
	var user = req.user;
	var id = req.body.id;

	Group.getById(id, function(err, group) {
		if (err) {return next(err)};

		if (group != null) {

			if (group.user.toString() == user._id.toString()) {
				return res.send({error: msg_error.group_creater_canot_leave});
			};

			if (group.users.indexOf(user._id) != -1) {
				group.users.pull(user._id);
			} else {
				group.users.push(user._id);
			}

			group.save(function(err, group) {
				if (err) {return next(err)};
				return res.send({success: msg_success.join_group_success});
			});
		} else {
			return res.send({error: msg_error.group_not_exit});
		}


	});
};

exports.create = function(req, res, next) {

	var name = sanitize(req.body.name).trim();
	name = sanitize(name).xss();
	var description = sanitize(req.body.description).trim();
	description = sanitize(description).xss();
	var access = sanitize(req.body.access).toInt();

	var community = req.user.addresses[0].community;


	if (name === '' || description === '' || access === '') {
		res.send({error: msg_error.input_empty});
	    return;
	};

	if (!check(access, msg_error.input_not_numeric).isInt()) {
		access = 1;
	};

	Group.getsBy({community: community, name: name}, null, null, function(err, groups) {
		if (err) {return next(err)};

		if (groups.length > 0) {
			res.send({error: msg_error.group_exit});
			return;
		};

		Group.save(name, description, access, req.user._id, community, [req.user._id], function(err, group) {
			if (err) {return next(err)};
			return res.send(group);
		});

	});
	

};

exports.delete = function(req, res, next) {
	var user = req.user;
	var id = sanitize(req.params.id).trim();

	if (id === "") {
		return res.send({error: msg_error.input_empty});
	};

	Group.remove({_id: id, user: user._id}, function(err) {
		if (err) {return next(err)};
		res.send({success: msg_success.delete_success});
	});
}


exports.getMembers = function(req, res, next) {
	var user = req.user;
	var id = sanitize(req.params.id).trim();

	Group.getMembers(id, function(err, group) {
		if (err) {return next(err)};

		return res.send(group.users);
	});
}


exports.kick = function(req, res, next) {
	var user = req.user;
	var groupId = req.body.group_id;
	var userId = req.body.user_id;

	Group.getBy({_id: groupId, user: user._id}, function(err, group) {
		if (err) {return next(err)};

		if (group.user.toString() == userId) {
			return res.send({error: msg_error.group_creater_canot_leave});
		};
		if (!group) {
			return res.send({error: msg_error.group_not_exit});
		}


		group.users.pull(userId);
		group.save(function(err, group) {
		if (err) {return next(err)};
			return res.send({success: msg_success.group_kick_success});
		});

	});
}


exports.invite = function(req, res, next) {
	var user = req.user;
	var groupId = req.body.group_id;
	var userId = req.body.user_id;

	Group.getBy({_id: groupId, user: user._id}, function(err, group) {
		if (err) {return next(err)};

		if (group.user.toString() == userId) {
			return res.send({error: msg_error.group_creater_canot_invite});
		};
		if (!group) {
			return res.send({error: msg_error.group_not_exit});
		}

		User.getById(userId, function(err, user) {
			if (err) {return next(err)};

			if (user) {
				if (group.users.indexOf(userId) == -1) {
					group.users.push(userId);
				}
				group.save(function(err, group) {
					if (err) {return next(err)};
					return res.send({success: msg_success.group_invite_success});
				});
			} else {
				return res.send({error: msg_error.user_not_exit});
			}

			

		});


		

	});
}