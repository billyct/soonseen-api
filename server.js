var restify = require('restify'),
    config = require('./config').config;

var route = require('./route');

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser({keepExtensions: true,limit: 10000000}));
server.use(restify.queryParser());

/*cors setting*/
server.use(function(req, res, next) {
	if (req.headers.origin) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
	}
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    next();

});
    




server.get('/', function(req, res, next) {
	res.send("soonseen api");
});



route(server);


server.listen(config.port, config.host, function() {
	console.log('have fun');
});