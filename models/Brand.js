const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
	name: { type: String, required: true },
	desc: { type: String, required: true },
	imageUrl: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Brand", BrandSchema);
