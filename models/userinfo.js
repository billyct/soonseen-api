var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserInfoSchema = new Schema({
	user : {type:ObjectId, index:true},
	address : {type:String},
	community : {type:ObjectId}
});

mongoose.model('UserInfo', UserInfoSchema);