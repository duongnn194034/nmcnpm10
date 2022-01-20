var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoClient = require('mongodb').MongoClient; // connect online
var uri = "mongodb+srv://nmcnpm:WKJKIF36EKIAsUjn@cluster0.n4el7.mongodb.net/SkyingClub?retryWrites=true&w=majority"; // connect online


var someschema = new Schema({
	title: {
        type: String,
        required: true
    },
    trademark: String,
    sex: {
        type: String,
        enum: ['NAM', 'NỮ', 'UNISEX']
    },
    ordering: Number,
	products_id: [{type: mongoose.Schema.Types.ObjectId}]
});

 function prodTypeCollection(callback) {
	MongoClient.connect(uri, function(err, db) {
		if (err) throw err;
		var dbo = db.db("skyingclub");
		dbo.collection("prodType").find().toArray(function(err, result) {
			if (err) {
				throw err;
				console.log(err);
			} else if (result.length > 0) {
				callback(result);
			}
		});
    db.close();
	});
}



module.exports = mongoose.model('prodType', someschema);
module.exports.prodTypeCollection = prodTypeCollection;
