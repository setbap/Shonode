const { check } = require("express-validator/check");

module.exports.list = [
	[
		check("name")
			.isString()
			.isLength({ min: 2, max: 25 })
			.trim(),
		check("lastname")
			.isString()
			.isLength({ min: 2, max: 32 })
			.trim(),
		check("city")
			.isString()
			.isLength({ min: 2, max: 32 })
			.trim(),
		check("state")
			.isString()
			.isLength({ min: 2, max: 32 })
			.trim(),
		check("address")
			.isString()
			.isLength({ min: 2, max: 64 })
			.trim(),

		// check("items.*.product").isMongoId(),
		// check("items.*.quantity")
		// 	.isNumeric()
		// 	.trim(),
		// check("user.email")
		// 	.isEmail()
		// 	.normalizeEmail(),
		// check("user.userId").isMongoId(),
	],
];
