const { check } = require("express-validator/check");

module.exports.list = [
	[
		//  email
		check("email")
			.isEmail()
			.normalizeEmail(),
		check("password")
			.isLength({ min: 5 })
			.withMessage("must be at least 5 chars long")
			.not()
			.isIn(["123", "password", "god"])
			.withMessage("Do not use a common word as the password")
			.matches(/\d/)
			.withMessage("must contain a number"),
		check("token")
			.exists()
			.isLength({ min: 10 }),
	],
];
