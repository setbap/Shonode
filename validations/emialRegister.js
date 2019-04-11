const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("userId")
			.exists()
			.isMongoId(),
	],
];
