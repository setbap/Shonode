const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("prodId")
			.isMongoId()
			.trim(),
	],
];
