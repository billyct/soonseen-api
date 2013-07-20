var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TimelineSchema = new Schema({
	user: {type:ObjectId},
	groups: [ObjectId],
	title: {type:String},
	content: {type:String},
	photos: [ObjectId],
	thxed_users:[ObjectId],
	tags:[String],
	create_at: {type:Date, default:Date.now},
	comments: [{
		user: {type:ObjectId},
		content :{type:String},
		create_at :{type:Date, default:Date.now}
	}]
});

mongoose.model('Timeline', TimelineSchema);