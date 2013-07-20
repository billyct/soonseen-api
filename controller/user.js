var User = require('../proxy').User;
var Group = require('../proxy').Group;
var Timeline = require('../proxy').Timeline;
var Photo = require('../proxy').Photo;

var check = require('validator').check,
	sanitize = require('validator').sanitize;

var msg_error = require('../lib/message').error,
	msg_success = require('../lib/message').success;

//var bcrypt = require('bcrypt');

var crypto = require('crypto');

var shortid = require('shortid');

var _ = require('underscore');

exports.signup = function(req, res, next) {
	var username = sanitize(req.body.username).trim();
	username = sanitize(username).xss();

	var email = sanitize(req.body.email).trim();
	email = email.toLowerCase();
	emial = sanitize(email).xss();

	var password = sanitize(req.body.password).trim();
	password = sanitize(password).xss();

	if (username === '' || password === '' || email === '') {
	    res.send({error: msg_error.input_empty, username: username, email: email});
	    return;
	}


	if (username.length < 5) {
		res.send({error: msg_error.username_length, username: username, email:email});
		return;
	};

	//判断有户名格式
	try {
		check(username, msg_error.username_incorrect).isAlphanumeric();
	} catch(e) {
		res.send({error:e.message, username: username, email: email});
	}

	//判断email格式对不对
	try {
	    check(email, msg_error.email_incorrect).isEmail();
	} catch (e) {
	    res.send({error: e.message, username: username, email: email});
	    return;
	}

	User.getsBy({'$or': [{'username': username}, {'email': email}]}, '-password', null, function(err, users) {
		if (err) {return next(err)};
		//判断有户名email有没有被使用
		if (users.length > 0) {
			return res.send({error: msg_error.username_email_used, username: username, email: email})
		}

		//密码加密
		// var salt = bcrypt.genSaltSync(10);
		// password = bcrypt.hashSync(password, salt);

		password = md5(password);

		var avatar_url = 'http://www.gravatar.com/avatar/' + md5(email.toLowerCase()) + '?size=100';

		//一个认证ID
		var token = shortid.generate();

		//用户名的分词索引
		var username_index = _.uniq(username.split(''));

		//active = false
		User.save(username, password, email, avatar_url, true, token, username_index, function(err, user) {
			if (err) {return next(err)};
			//这个部分可能还有邮件发送
			/*！！！！！！！！！！！*/

			user.toJSON();
			user.password = undefined;
			return res.send(user);
			
		});

	});

};


exports.signin = function(req, res, next) {


	var email = sanitize(req.body.email).trim();
	var password = sanitize(req.body.password).trim();


	if (!email || !password) {
		res.send({error: msg_error.input_empty});
		return;
	};

	User.getBy({email : email}, null, function(err, user) {
		if (err) {return next(err)};

		if (!user) {
			res.send({error:msg_error.user_not_exit});
			return ;
		}

		//密码判断
		//if (bcrypt.compareSync(password, user.password)) {
		password = md5(password);
		if ( password != user.password ) {
			res.send({error: msg_error.password_incorrect});
			return ;
		};

		if (!user.active) {
			//用户没有激活!
			/*!!!!!!!!!!!*/
		};
		var token = shortid.generate();
		user.token = token;

		user.save(function(err, user){
			if (err) {return next(err)};

			user.toJSON();
			user.password = undefined;
			return res.send(user);
		});
		
	});
};

exports.me = function(req, res, next) {
	//认证

	res.send(req.user);
	return ;
	// auth(req, next, function(user){
	// 	res.send(user);
	// });
	
};


exports.search = function(req, res, next) {
	var user = req.user;

	//关键词
	var keyword = req.params.keyword;
	var groupId = req.params.group_id;

	if (_.isUndefined(keyword)) {
		keyword = '';
	};
	
	keyword = _.uniq(keyword.split(''));


	if (groupId == 'undefined' || _.isUndefined(groupId)) {
		return res.send([]);
	};

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
	

	var communities = new Array();
	for (var i = user.addresses.length - 1; i >= 0; i--) {
		communities.push(user.addresses[i].community);
	};


	/*查找在group里存在的用户*/

	Group.getById(groupId, function(err, group) {
		if (err) {return next(err)};

		if (group) {
			User.getNeighbors({_id:{$nin:group.users}, 'username_index':{$all:keyword}, 'addresses.community': {$in:communities}}, {skip:skip, limit:count}, function(err, users) {
				if (err) {return next(err)};

				return res.send(users);
			});
		};

	});

	
}

exports.neighbors = function(req, res, next) {
	var user = req.user;
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

	var communities = new Array();
	for (var i = user.addresses.length - 1; i >= 0; i--) {
		communities.push(user.addresses[i].community);
	};

	User.getNeighbors({'addresses.community': {$in:communities}}, {skip:skip, limit:count}, function(err, users) {
		if (err) {return next(err)};
		return res.send(users);
	});
}


exports.update = function(req, res, next) {

	var user = req.user;

	var email = sanitize(req.body.email).trim();
	var phone = sanitize(req.body.phone).trim();
    var signature = sanitize(req.body.signature).trim();
    var access = req.body.access;
    var avatar = req.body.avatar;

    user.contact_information.email = email;
    user.contact_information.phone = phone;
    user.signature = signature;
    user.access = access;
    user.avatar = avatar;


    user.save(function(err, user) {
    	if (err) {return next(err)};
    	return res.send(user);
    });
}


exports.delete_avatar = function(req, res, next) {
	var user = req.user;

	var avatar_url = 'http://www.gravatar.com/avatar/' + md5(user.email.toLowerCase()) + '?size=100';

	user.avatar = avatar_url;

	user.save(function(err, user) {
		if (err) {return next(err)};
		console.log(user);
		return res.send({avatar:user.avatar});
	});

}

exports.stats = function(req, res, next) {
	var user = req.user;

	var stats = {};

	
	//timeline数量
	Timeline.count({user: user._id}, function(err, t_count) {
		if (err) {return next(err)};
		stats.post = t_count;


		//照片数量
		Photo.count({user: user._id}, function(err, p_count) {
			if (err) {return next(err)};
			stats.photo = p_count;

			//查找有多少的评论数量
			Timeline.aggregate([
			{ $unwind : "$comments" },
			{ $match : { 'comments.user':user._id } },
			{ $group: {_id:null, count:{$sum:1}}},
			{ $project : {_id:0, count:1}},
			],function(err, result) {
				if (err) {return next(err)};
				stats.reply = result[0].count;

				return res.send(stats);
			});
		});
	});
}


// exports.get = function(req, res, next) {
// 	var id = sanitize(res.params[0]).trim();
// 	auth(req, next, function(user) {

// 	});
// };






function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}