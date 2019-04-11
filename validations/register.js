const { check } = require("express-validator/check");

module.exports.list = [
	[
		//  email
		check("email")
			.isEmail()
			.normalizeEmail(),
		// password must be at least 5 chars long
		check("name").isLength({ min: 2, max: 32 }),
		check("password")
			.isLength({ min: 5 })
			.withMessage("must be at least 5 chars long")
			.not()
			.isIn(["123", "password", "god"])
			.withMessage("Do not use a common word as the password")
			.matches(/\d/)
			.withMessage("must contain a number"),
		check(
			"passwordconfrim",
			"passwordConfirmation field must have the same value as the password field"
		)
			.exists()
			.custom((value, { req }) => value === req.body.password)
	]
];
