const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("prodId")
			.isMongoId()
			.trim(),
		check("title")
			.isString()
			.isLength({ max: 20 })
			.trim(),
		check("content")
			.isString()
			.isLength({ max: 220 })
			.trim(),
	],
];
