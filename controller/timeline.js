var Timeline = require('../proxy').Timeline;
var Group = require('../proxy').Group;
var Photo = require('../proxy').Photo;

var _ = require('underscore');
var moment = require('moment');

var check = require('validator').check,
	sanitize = require('validator').sanitize;


var msg_error = require('../lib/message').error,
	msg_success = require('../lib/message').success;


exports.create = function(req, res, next) {
	var user = req.user;
	var groups = req.body.groups;
	var title = sanitize(req.body.title).trim();
	title = sanitize(title).xss();
	var content = sanitize(req.body.content).trim();
	content = sanitize(content).xss();
	var photos = req.body.photos;
	var tags = req.body.tags;

	if (content === '') {
		return res.send({error: msg_error.input_empty});
	};

	if (_.isEmpty(groups)) {
		return res.send({error: msg_error.group_not_exit});
	};

	if ((!_.isEmpty(groups) && !_.isArray(groups)) || 
		(!_.isEmpty(photos) && !_.isArray(photos)) || 
		(!_.isEmpty(tags) && !_.isArray(tags))) {
		return res.send({error: msg_error.intput_not_array});
	};


	// if (title === '') {
	// 	title = moment().format('YYYY-MM-DD HH:mm:ss');
	// };


	Timeline.save(user._id, groups, title, content, photos, tags, function(err, timeline) {
		if (err) {return next(err)};

		Timeline.getById(timeline._id, function(err, timeline) {
			if (err) {return next(err)};
			
			return res.send(timeline);
		});
		
	});

};

exports.getList = function(req, res, next) {
	var user = req.user;

	/* begin 设置时间*/
	var day_past = req.params.past;
	if (_.isUndefined(day_past)) {
		day_past = 0;
	};
	var today_start = moment().startOf('day').unix();
	var past_start = moment.unix(today_start-86400*day_past);
	var past_end = moment.unix(today_start-86400*(day_past-1));

	/* end*/

	/* begin 分页设置*/
	var count = req.params.count;
	var page = req.params.page;


	if (_.isUndefined(count) || count>20) {
		count = 10;
	};

	if (_.isUndefined(page)) {
		page = 1;
	};

	var skip = (page-1)*count;
	/* end*/

	

	Group.getsBy({users: req.user._id}, '_id', null, function(err, groups) {
		if (err) {return next(err)};

		if (groups.length > 0) {
			//传说skip的性能不好，不过暂且这样做吧~
			Timeline.getsBy({
				'groups': {$in : groups},
				create_at: {"$gte": past_start.toDate(), "$lt": past_end.toDate()}
			}, null, {sort:{create_at: -1}, skip:skip, limit:count}, function(err, timelines) {
				if (err) {return next(err)};

				return res.send(timelines);
			});
		} else {
			return res.send({error: msg_error.group_not_exit});
		}

		
	});
};

exports.getListByGroup = function(req, res,next) {
	var user = req.user;
	var id = req.params.id;

	/* begin 设置时间*/
	var day_past = req.params.past;
	if (_.isUndefined(day_past)) {
		day_past = 0;
	};
	var today_start = moment().startOf('day').unix();
	var past_start = moment.unix(today_start-86400*day_past);
	var past_end = moment.unix(today_start-86400*(day_past-1));

	/* end*/


	/* begin 分页设置*/
	var count = req.params.count;
	var page = req.params.page;


	if (_.isUndefined(count) || count>20) {
		count = 10;
	};

	if (_.isUndefined(page)) {
		page = 1;
	};

	var skip = (page-1)*count;
	/* end*/

	Group.getBy({_id:id}, '_id', function(err, group) {
		if (err) {return next(err)};

		if (group != null) {
			Timeline.getsBy({
				'groups': group,
				create_at: {"$gte": past_start.toDate(), "$lt": past_end.toDate()}
			}, null, {sort:{create_at: -1}, skip:skip, limit:count}, function(err, timelines) {
				if (err) {return next(err)};

				return res.send(timelines);
			});
		} else {
			return res.send({error: msg_error.group_not_exit});
		}
	});
}

exports.createComment = function(req, res, next) {
	var user = req.user;
	var content = sanitize(req.body.comment).trim();
	content = sanitize(content).xss();
	var tlId = sanitize(req.body.id).trim();

	if (content === "" || tlId === "") {
		return res.send({error: msg_error.input_empty});
	};

	var comment = {
		user : req.user._id,
		content : content
	}

	Timeline.update({_id: tlId}, {$push: {comments: comment}}, function(err, timeline) {
		if (err) {return next(err)};

		res.send(comment);
	});
};

exports.thanks = function(req, res, next) {
	var user = req.user;
	var id = sanitize(req.body.id).trim();
	if (id === "") {
		return res.send({error: msg_error.input_empty});
	};

	Timeline.getById(id, function(err, tl) {
		if (err) {return next(err)};

		if (tl == null) {
			return res.send({error: msg_error.timeline_not_exit});
		};


		if (tl.thxed_users.indexOf(user._id) != -1) {
			tl.thxed_users.pull(user._id);
		} else {
			tl.thxed_users.push(user._id);
		}

		tl.save(function(err, tl) {
			if (err) {return next(err)};

			return res.send({success:msg_success.thxed});
		});

	});
};

// exports.past = function(req, res, next) {
// 	var user = req.user;
// 	var num = sanitize(req.params.num).trim();

// 	var today_start = moment().startOf('day').unix();
// 	var start = moment.unix(today_start-86400*num);
// 	var end = moment.unix(today_start-86400*(num-1));

// 	/* begin 分页设置*/
// 	var count = req.params.count;
// 	var page = req.params.page;


// 	if (_.isUndefined(count) || count>20) {
// 		count = 10;
// 	};

// 	if (_.isUndefined(page)) {
// 		page = 1;
// 	};

// 	var skip = (page-1)*count;
// 	/* end*/

// 	Timeline.getsBy(
// 		{create_at: {"$gte": start.toDate(), "$lt": end.toDate()}}, 
// 		null, 
// 		{sort:{create_at: -1}, skip:skip, limit:count}, 
// 		function(err, timelines) {
// 		if (err) {return next(err)};

// 		return res.send(timelines);
// 	});
// }

exports.delete = function(req, res, next) {
	var user = req.user;
	var id = sanitize(req.params.id).trim();

	if (id === "") {
		return res.send({error: msg_error.input_empty});
	};

	Timeline.remove({_id: id, user: user._id}, function(err) {
		if (err) {return next(err)};
		return res.send({success: msg_success.delete_success});
	});
}
