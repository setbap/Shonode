const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
	email: { type: String, required: true },
	prodsAccess: { type: Boolean, required: true },
	orderAccess: { type: Boolean, required: true },
	userId: {
		type: Schema.Types.ObjectId,
		required: true
	}
});

module.exports = mongoose.model("Admin", AdminSchema);
