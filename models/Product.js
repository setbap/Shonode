const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},

		size: {
			type: String,
			required: false,
		},
		count: {
			type: Number,
			default: 1,
		},

		color: {
			type: String,
			required: true,
		},

		material: {
			type: String,
			required: false,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			require: true,
		},
		brand: {
			type: Schema.Types.ObjectId,
			ref: "Brand",
			require: true,
		},
		offPrice: {
			type: String,
		},
		description: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		spec: [
			{
				name: { type: String, required: true },
				desc: { type: String, required: true },
			},
		],
		comments: [
			{
				title: { type: String, required: true, maxlength: 255 },
				content: { type: String, required: true },
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
		iWant: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{ timestamps: true },
);
productSchema.methods.addComment = function(title, content, userId) {
	this.comments.push({
		title,
		content,
		userId,
	});
	return this.save();
};

productSchema.index({ "$**": "text" });

module.exports = mongoose.model("product", productSchema);
