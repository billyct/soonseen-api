var restify = require('restify');
var User = require('../proxy').User;
var msg_error = require('../lib/message').error;

var check = require('validator').check,
	sanitize = require('validator').sanitize;


//认证token
exports.auth = function(req, res, next) {
	var token = sanitize(req.params.token || req.body.token).trim();

	if (token === '') {
		return res.send({error:msg_error.token_miss});
	};

	User.getBy({token: token}, function(err, user) {
		if (err) {return next(err)};

		if (!user) {
			return res.send({error:msg_error.token_expired});
		};

		req.user = user;
		return next();
	});
};

//cors跨域
exports.corsHandler = function(req, res, next) {

    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token');
    // res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
    // res.header('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    // res.header('Access-Control-Max-Age', '1000');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");

    return next();
}


