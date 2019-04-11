const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preUserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		resetCode: {
			type: String,
			required: false,
		},
		end: {
			type: Date,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("PreUser", preUserSchema);
