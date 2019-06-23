const { check } = require("express-validator/check");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
module.exports.list = [
	[
		check("catId")
			.optional()
			.isMongoId()
			.custom((value, { req }) => {
				return Category.findById({ _id: value }).then((cat) => {
					if (!cat) {
						return Promise.reject("wrong category");
					}
				});
			})
			.trim(),
	],
];
