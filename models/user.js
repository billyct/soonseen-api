var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	username: {type:String, index:true, unique:true},
	display_name: {type:String},
	email: {type:String, unique:true},
	password: {type:String},
	avatar: {type: String},
	active: {type: Boolean, default: true},
	access: {type: Boolean, default:true}, //是否公开自己的信息
	addresses : [{
		address : {type: String},
		community : {type: ObjectId}
	}],
	create_at: {type:Date, default:Date.now},
	update_at: {type:Date, default:Date.now},
	token: {type:String}, // 用于登录状态
	username_index: [String], //用于搜索

	contact_information : {
		phone : {type:String, default:null},
		email: {type:String, default:null}
	},
	signature : {type:String}
});

mongoose.model('User', UserSchema);