var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
	user : {type: ObjectId},
	path : {type: String},
	path_thumb : {type: String}
});

mongoose.model('Photo', PhotoSchema);