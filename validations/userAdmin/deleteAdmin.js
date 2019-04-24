const { check } = require("express-validator/check");

module.exports.list = [
	[
		//  email
		check("email")
			.isEmail()
			.normalizeEmail(),
	],
];
