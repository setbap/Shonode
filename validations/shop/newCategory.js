const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("name")
			.isString()
			.isLength({ min: 5, max: 25 })
			.trim(),
		check("gender")
			.isString()
			.isLength({ max: 10 })
			.trim(),
		check("imageUrl")
			.isLength({ min: 5 })
			.isString()
			.trim(),
	],
];
