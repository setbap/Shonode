const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("prodId")
			.isMongoId()
			.trim(),
		check("title")
			.isString()
			.isLength({ min: 4, max: 20 })
			.trim(),
		check("content")
			.isString()
			.isLength({ min: 8, max: 220 })
			.trim(),
	],
];
