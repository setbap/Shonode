const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
	items: [
		{
			product: { type: Object, required: true },
			quantity: { type: Number, required: true },
		},
	],
	user: {
		email: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	deliver: { type: Boolean, default: false },
	name: { type: String, required: true },
	lastname: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	address: { type: String, required: true },
	price: { type: Number, required: true },
});
OrderSchema.methods.delivered = function() {
	this.delivered = true;
	return this.save();
};

module.exports = mongoose.model("Order", OrderSchema);
