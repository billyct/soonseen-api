var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var GroupSchema = new Schema({
	name : {type:String},
	description : {type:String},
	access : {type:Number, max:3, min:1, defaults:1},
	community : {type:ObjectId},
	user : {type: ObjectId},
	users : [ObjectId]
});

mongoose.model('Group', GroupSchema);