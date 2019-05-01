const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	name: { type: String, required: true },
	gender: { type: String, required: true },
	imageUrl: {
		type: String,
		required: true,
	},
});
CategorySchema.index({ "$**": "text" });

module.exports = mongoose.model("Category", CategorySchema);
