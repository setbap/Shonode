const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("name")
			.isString()
			.isLength({ min: 5, max: 25 })
			.trim(),
		check("desc")
			.isString()
			.isLength({ min: 10 })
			.trim(),
		check("imageUrl")
			.isString()
			.trim(),
	],
];
