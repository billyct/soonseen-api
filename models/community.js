var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommunitySchema = new Schema({
	state: {type:String},
	city: {type:String},
	area: {type:String},
	community: {type:String},
});

mongoose.model('Community', CommunitySchema);