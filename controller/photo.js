var Photo = require('../proxy').Photo;

var check = require('validator').check,
	sanitize = require('validator').sanitize;


var msg_error = require('../lib/message').error,
	msg_success = require('../lib/message').success;

var file = require('../lib/file');
var mime = require('mime');

// var mmm = require('mmmagic'),
// 	Magic = mmm.Magic;
// var magic = new Magic(mmm.MAGIC_MIME_TYPE);


exports.upload = function(req, res, next) {
	var user = req.user;
	var photo = req.files.photo;

	// magic.detectFile(photo.path, function(err, result) {
	//   	if (err) throw err;
	//   	console.log(result);
	//   	if (result != 'image/gif' && result != 'image/png' && result != 'image/jpeg') {
	//   		console.log("error")
	//   	};
	// });
	

	/* begin 关于图片的格式验证 以及图片唯一名称的存储*/
	var type = mime.lookup(photo.path);
	var extension = mime.extension(type);

	if (type != 'image/gif' && type != 'image/png' && type != 'image/jpeg') {
		return res.send({error: msg_error.image_type});
	};

	var d = new Date();
	var name = user.username + '_' + d.getTime() + '.' + extension;

	/* end */

	var result = file.upload(photo.path, name, function(result) {
		var image_url = file.domain+name;
		if (result) {
			Photo.save(user._id, image_url, image_url+'-thumb', function(err, photo) {
				if (err) {return next(err)};
				return res.send(photo);
			});
		} else {
			return res.send({error: msg_error.upload_file_error});
		}
	});

	
};