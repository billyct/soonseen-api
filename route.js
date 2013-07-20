var user = require('./controller/user');
var userinfo = require('./controller/userinfo');
var community = require('./controller/community');
var middleware = require('./controller/middleware');
var group = require('./controller/group');
var timeline = require('./controller/timeline');
var photo = require('./controller/photo');

module.exports = function(app) {


	/*preflight setting*/
	app.opts(/\.*/, function (req, res, next) {
	    if (req.headers.origin && req.headers['access-control-request-method']) {
	        res.header('Access-Control-Allow-Origin', req.headers.origin);
	        res.header('Access-Control-Allow-Credentials', 'true');
	        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
	        res.header('Access-Control-Expose-Headers', 'Set-Cookie');
	        res.header('Allow', req.headers['access-control-request-method']);
	        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
	        req.log.info({ url:req.url, method:req.headers['access-control-request-method'] }, "Preflight");
	        res.send(204);
	        next();
        } else {
        	res.send(404);
        	next();
    	}
	});

	app.post('/signin', user.signin);
	app.post('/signup', user.signup);
	app.get('/me', middleware.auth, user.me);
	app.get('/neighbors', middleware.auth, user.neighbors);
	app.get('/search', middleware.auth, user.search);
	app.get('/stats', middleware.auth, user.stats);
	app.put('/delete_avatar', middleware.auth, user.delete_avatar);
	app.put('/update_profile', middleware.auth, user.update);

	app.post('/userinfo/address', middleware.auth, userinfo.createAddress);

	app.get('/communitys', middleware.auth, community.getList);
	app.post('/communitys', middleware.auth, community.create);

	app.get('/groups', middleware.auth, group.getList);
	app.post('/groups', middleware.auth, group.create);
	app.post('/groups/:id/join', middleware.auth, group.join);
	app.get('/groups/:id', middleware.auth, group.get);
	app.get('/groups/:id/members', middleware.auth, group.getMembers);
	app.del('/groups/:id', middleware.auth, group.delete);
	app.post('/groups/kick', middleware.auth, group.kick);
	app.post('/groups/invite', middleware.auth, group.invite);


	app.get('/timelines', middleware.auth, timeline.getList);
	app.post('/timelines', middleware.auth, timeline.create);
	app.del('/timelines', middleware.auth, timeline.delete);
	app.post('/timelines/thanks', middleware.auth, timeline.thanks);
	app.get('/timelines/group', middleware.auth, timeline.getListByGroup);


	app.post('/timeline/comments', middleware.auth, timeline.createComment);


	app.post('/photos', middleware.auth, photo.upload);
};


